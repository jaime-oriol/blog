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
  email: string
): Promise<{ id: string; unsubscribed: boolean } | null> {
  if (!process.env.RESEND_AUDIENCE_ID) {
    throw new Error('RESEND_AUDIENCE_ID no configurado')
  }

  try {
    const response = await listContactsWithRetry({
      audience_id: process.env.RESEND_AUDIENCE_ID,
    })

    if (response.error) {
      console.error('Error listing contacts:', response.error)
      return null
    }

    const contact = response.data?.data.find(
      (contact) => contact.email.toLowerCase() === email.toLowerCase()
    )

    return contact
      ? {
          id: contact.id,
          unsubscribed: contact.unsubscribed,
        }
      : null
  } catch (error) {
    console.error('Error finding contact by email:', error)
    return null
  }
}

async function activateContact(contactId: string): Promise<boolean> {
  if (!process.env.RESEND_AUDIENCE_ID) {
    throw new Error('RESEND_AUDIENCE_ID no configurado')
  }

  try {
    const response = await updateContactWithRetry({
      audience_id: process.env.RESEND_AUDIENCE_ID,
      id: contactId,
      unsubscribed: false,
    })

    if (response.error) {
      console.error('Error activating contact:', response.error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error activating contact:', error)
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
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token de confirmación requerido' }, { status: 400 })
    }

    // Limpiar cache expirado
    cleanExpiredCache()

    // Verificar si ya procesamos este token exitosamente (idempotencia)
    const cachedResult = confirmationCache.get(token)
    if (cachedResult) {
      console.log('Returning cached result for token:', token.substring(0, 20) + '...')
      return NextResponse.json(cachedResult.result)
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Configuración de email no disponible' }, { status: 500 })
    }

    if (!process.env.RESEND_AUDIENCE_ID) {
      return NextResponse.json({ error: 'Audience ID no configurado' }, { status: 500 })
    }

    const tokenVerification = verifyConfirmationToken(token)

    if (!tokenVerification.valid) {
      console.log('Token verification failed:', {
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
    const contact = await findContactByEmail(email)

    if (!contact) {
      console.log('Contact not found for email:', email)
      return NextResponse.json(
        { error: 'Contacto no encontrado. Solicita una nueva suscripción.' },
        { status: 404 }
      )
    }

    console.log('Contact found:', {
      email: email,
      contactId: contact.id,
      unsubscribed: contact.unsubscribed,
    })

    let result
    if (!contact.unsubscribed) {
      result = {
        message: '¡Suscripción confirmada! Tu email ya estaba confirmado anteriormente.',
        email: email,
        status: 'already_confirmed',
      }
    } else {
      const activated = await activateContact(contact.id)

      if (!activated) {
        return NextResponse.json(
          { error: 'Error al activar la suscripción. Inténtalo de nuevo.' },
          { status: 500 }
        )
      }

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

    return NextResponse.json(result)
  } catch (error) {
    console.error('Newsletter confirmation error:', error)
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
