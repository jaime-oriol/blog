import { NextRequest, NextResponse } from 'next/server'
import { verifyConfirmationToken } from '@/lib/jwt-tokens'
import { listContactsWithRetry, updateContactWithRetry } from '@/lib/resend'

// Cache para idempotencia - evitar procesamiento doble del mismo token
interface CachedResult {
  result: {
    message: string
    email: string
    status?: string
  }
  timestamp: number
}

const confirmationCache = new Map<string, CachedResult>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutos

async function findContactByEmail(
  email: string,
  maxRetries: number = 3
): Promise<{ id: string; unsubscribed: boolean } | null> {
  if (!process.env.RESEND_AUDIENCE_ID) {
    throw new Error('RESEND_AUDIENCE_ID no configurado')
  }

  console.log(`[FIND] Searching for contact: ${email} (max retries: ${maxRetries})`)

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[FIND] Attempt ${attempt}/${maxRetries} for ${email}`)

      const response = await listContactsWithRetry({
        audience_id: process.env.RESEND_AUDIENCE_ID,
      })

      if (response.error) {
        console.error(`[FIND] Error listing contacts (attempt ${attempt}):`, response.error)

        if (attempt === maxRetries) {
          return null
        }

        // Wait before retry with exponential backoff
        const waitTime = Math.pow(2, attempt - 1) * 1000
        console.log(`[FIND] Waiting ${waitTime}ms before retry...`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        continue
      }

      console.log(`[FIND] Retrieved ${response.data?.data?.length || 0} contacts`)

      const contact = response.data?.data.find(
        (contact) => contact.email.toLowerCase() === email.toLowerCase()
      )

      if (contact) {
        console.log(`[FIND] Found contact:`, {
          email,
          contactId: contact.id,
          unsubscribed: contact.unsubscribed,
          attempt,
        })
        return {
          id: contact.id,
          unsubscribed: contact.unsubscribed,
        }
      }

      console.log(`[FIND] Contact not found in attempt ${attempt} for ${email}`)

      if (attempt < maxRetries) {
        // Wait before retry - contact might need time to propagate in Resend
        const waitTime = Math.pow(2, attempt - 1) * 1000
        console.log(`[FIND] Contact not found, waiting ${waitTime}ms before retry...`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }
    } catch (error) {
      console.error(`[FIND] Exception in attempt ${attempt} for ${email}:`, error)

      if (attempt === maxRetries) {
        return null
      }

      // Wait before retry
      const waitTime = Math.pow(2, attempt - 1) * 1000
      console.log(`[FIND] Exception occurred, waiting ${waitTime}ms before retry...`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }

  console.log(`[FIND] All attempts failed for ${email}`)
  return null
}

async function activateContact(contactId: string, email: string): Promise<boolean> {
  if (!process.env.RESEND_AUDIENCE_ID) {
    throw new Error('RESEND_AUDIENCE_ID no configurado')
  }

  console.log(`[ACTIVATE] Starting activation for contact: ${contactId} (${email})`)

  try {
    const response = await updateContactWithRetry({
      audienceId: process.env.RESEND_AUDIENCE_ID,
      id: contactId,
      unsubscribed: false,
    })

    console.log(`[ACTIVATE] Update response:`, {
      contactId,
      email,
      hasError: !!response.error,
      error: response.error,
      data: response.data,
    })

    if (response.error) {
      console.error(`[ACTIVATE] Error activating contact ${contactId} (${email}):`, response.error)
      return false
    }

    console.log(`[ACTIVATE] Successfully activated contact: ${contactId} (${email})`)
    return true
  } catch (error) {
    console.error(`[ACTIVATE] Exception activating contact ${contactId} (${email}):`, error)
    return false
  }
}

function cleanExpiredCache() {
  const now = Date.now()
  for (const [token, cached] of confirmationCache.entries()) {
    if (now - cached.timestamp > CACHE_DURATION) {
      confirmationCache.delete(token)
    }
  }
}

export async function GET(request: NextRequest) {
  const startTime = Date.now()

  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    console.log(`[CONFIRM] Starting confirmation process - token: ${token?.substring(0, 20)}...`)

    if (!token) {
      console.log('[CONFIRM] Missing token')
      return NextResponse.json({ error: 'Token de confirmación requerido' }, { status: 400 })
    }

    // Limpiar cache expirado
    cleanExpiredCache()

    // Verificar si ya procesamos este token exitosamente (idempotencia)
    const cachedResult = confirmationCache.get(token)
    if (cachedResult) {
      console.log(`[CONFIRM] Returning cached result for token: ${token.substring(0, 20)}...`)
      return NextResponse.json(cachedResult.result)
    }

    if (!process.env.RESEND_API_KEY) {
      console.error('[CONFIRM] RESEND_API_KEY not configured')
      return NextResponse.json({ error: 'Configuración de email no disponible' }, { status: 500 })
    }

    if (!process.env.RESEND_AUDIENCE_ID) {
      console.error('[CONFIRM] RESEND_AUDIENCE_ID not configured')
      return NextResponse.json({ error: 'Audience ID no configurado' }, { status: 500 })
    }

    console.log('[CONFIRM] Verifying token...')
    const tokenVerification = verifyConfirmationToken(token)

    if (!tokenVerification.valid) {
      console.log('[CONFIRM] Token verification failed:', {
        token: token.substring(0, 20) + '...',
        expired: tokenVerification.expired,
        valid: tokenVerification.valid,
      })

      if (tokenVerification.expired) {
        return NextResponse.json(
          { error: 'Token de confirmación expirado. Solicita una nueva suscripción.' },
          { status: 404 }
        )
      }
      return NextResponse.json(
        { error: 'Token de confirmación no válido o expirado' },
        { status: 404 }
      )
    }

    const email = tokenVerification.email!
    console.log(`[CONFIRM] Token valid for email: ${email}`)
    console.log(`[CONFIRM] Starting contact search...`)

    const contact = await findContactByEmail(email, 5) // Aumentado a 5 intentos

    if (!contact) {
      console.error(`[CONFIRM] Contact not found for email: ${email}`)
      return NextResponse.json(
        { error: 'Contacto no encontrado. Solicita una nueva suscripción.' },
        { status: 404 }
      )
    }

    console.log(`[CONFIRM] Contact found:`, {
      email: email,
      contactId: contact.id,
      unsubscribed: contact.unsubscribed,
    })

    let result
    if (!contact.unsubscribed) {
      console.log(`[CONFIRM] Contact ${contact.id} (${email}) already confirmed`)
      result = {
        message: '¡Suscripción confirmada! Tu email ya estaba confirmado anteriormente.',
        email: email,
        status: 'already_confirmed',
      }
    } else {
      console.log(`[CONFIRM] Contact ${contact.id} (${email}) needs activation`)
      const activated = await activateContact(contact.id, email)

      if (!activated) {
        const elapsedTime = Date.now() - startTime
        console.error(
          `[CONFIRM] Failed to activate contact ${contact.id} (${email}) after ${elapsedTime}ms - returning 500 error`
        )
        return NextResponse.json(
          { error: 'Error al activar la suscripción. Inténtalo de nuevo.' },
          { status: 500 }
        )
      }

      console.log(`[CONFIRM] Contact ${contact.id} (${email}) successfully activated`)
      result = {
        message: '¡Suscripción confirmada correctamente! Recibirás la newsletter periódicamente.',
        email: email,
        status: 'confirmed',
      }
    }

    // Cachear el resultado exitoso para evitar procesamiento doble
    confirmationCache.set(token, {
      result,
      timestamp: Date.now(),
    })

    const elapsedTime = Date.now() - startTime
    console.log(`[CONFIRM] Successfully completed confirmation for ${email} in ${elapsedTime}ms`)

    return NextResponse.json(result)
  } catch (error) {
    const elapsedTime = Date.now() - startTime
    console.error(`[CONFIRM] Newsletter confirmation error after ${elapsedTime}ms:`, error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Método no permitido. Usa GET con el token en la URL.' },
    { status: 405 }
  )
}
