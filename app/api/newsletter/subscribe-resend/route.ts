import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import crypto from 'crypto'
import { readFileSync } from 'fs'
import { join } from 'path'

const resend = new Resend(process.env.RESEND_API_KEY)

function getBaseUrl(request: NextRequest): string {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }

  const host = request.headers.get('host')
  const protocol = request.headers.get('x-forwarded-proto') || 'https'
  return `${protocol}://${host}`
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function generateConfirmationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

async function loadEmailTemplate(): Promise<string> {
  try {
    const templatePath = join(process.cwd(), 'emails', 'confirmation-template.html')
    return readFileSync(templatePath, 'utf-8')
  } catch (error) {
    console.error('Error loading email template:', error)
    throw new Error('No se pudo cargar la plantilla del email')
  }
}

async function checkExistingContact(
  email: string
): Promise<{ exists: boolean; confirmed?: boolean }> {
  if (!process.env.RESEND_AUDIENCE_ID) {
    throw new Error('RESEND_AUDIENCE_ID no configurado')
  }

  try {
    const response = await resend.contacts.list({
      audienceId: process.env.RESEND_AUDIENCE_ID,
    })

    if (response.error) {
      console.error('Error checking contacts:', response.error)
      return { exists: false }
    }

    const existingContact = response.data?.data.find(
      (contact) => contact.email.toLowerCase() === email.toLowerCase()
    )

    if (existingContact) {
      return {
        exists: true,
        confirmed: existingContact.unsubscribed === false,
      }
    }

    return { exists: false }
  } catch (error) {
    console.error('Error checking existing contact:', error)
    return { exists: false }
  }
}

async function addContactToAudience(
  email: string,
  confirmationToken: string
): Promise<{ success: boolean; contactId?: string }> {
  if (!process.env.RESEND_AUDIENCE_ID) {
    throw new Error('RESEND_AUDIENCE_ID no configurado')
  }

  try {
    const response = await resend.contacts.create({
      audienceId: process.env.RESEND_AUDIENCE_ID,
      email: email.toLowerCase(),
      firstName: '',
      lastName: '',
      unsubscribed: true,
    })

    if (response.error) {
      console.error('Error creating contact:', response.error)
      throw new Error('Error al añadir contacto a Resend')
    }

    return {
      success: true,
      contactId: response.data?.id,
    }
  } catch (error) {
    console.error('Error adding contact to audience:', error)
    throw error
  }
}

async function sendConfirmationEmail(
  email: string,
  confirmationToken: string,
  baseUrl: string
): Promise<void> {
  try {
    const template = await loadEmailTemplate()
    const confirmationUrl = `${baseUrl}/newsletter/confirm?token=${confirmationToken}`

    const htmlContent = template.replace(/{{CONFIRMATION_URL}}/g, confirmationUrl)

    const response = await resend.emails.send({
      from: 'FootballDecoded Newsletter <newsletter@footballdecoded.com>',
      to: [email],
      subject: '⚽ Confirma tu suscripción a FootballDecoded',
      html: htmlContent,
    })

    if (response.error) {
      console.error('Error sending confirmation email:', response.error)
      throw new Error('Error al enviar email de confirmación')
    }
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    throw error
  }
}

const pendingConfirmations = new Map<
  string,
  {
    email: string
    token: string
    contactId?: string
    createdAt: number
  }
>()

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email no válido' }, { status: 400 })
    }

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Configuración de email no disponible' }, { status: 500 })
    }

    if (!process.env.RESEND_AUDIENCE_ID) {
      return NextResponse.json({ error: 'Audience ID no configurado' }, { status: 500 })
    }

    const existingContact = await checkExistingContact(email)

    if (existingContact.exists && existingContact.confirmed) {
      return NextResponse.json(
        { message: 'Ya estás suscrito y confirmado en la newsletter' },
        { status: 200 }
      )
    }

    const confirmationToken = generateConfirmationToken()

    let contactId: string | undefined

    if (!existingContact.exists) {
      const result = await addContactToAudience(email, confirmationToken)
      if (!result.success) {
        throw new Error('Error al crear contacto en Resend')
      }
      contactId = result.contactId
    }

    pendingConfirmations.set(confirmationToken, {
      email: email.toLowerCase(),
      token: confirmationToken,
      contactId,
      createdAt: Date.now(),
    })

    const baseUrl = getBaseUrl(request)
    await sendConfirmationEmail(email, confirmationToken, baseUrl)

    return NextResponse.json({
      message:
        '¡Perfecto! Te hemos enviado un email de confirmación. Revisa tu bandeja de entrada.',
      email: email,
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      {
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    if (!process.env.RESEND_AUDIENCE_ID) {
      return NextResponse.json({ error: 'Audience ID no configurado' }, { status: 500 })
    }

    const response = await resend.contacts.list({
      audienceId: process.env.RESEND_AUDIENCE_ID,
    })

    if (response.error) {
      return NextResponse.json({ error: 'Error obteniendo estadísticas' }, { status: 500 })
    }

    const contacts = response.data?.data || []
    const confirmed = contacts.filter((contact) => !contact.unsubscribed).length
    const pending = contacts.filter((contact) => contact.unsubscribed).length

    return NextResponse.json({
      total: contacts.length,
      confirmed,
      pending,
    })
  } catch (error) {
    console.error('Error getting newsletter stats:', error)
    return NextResponse.json({ error: 'Error obteniendo estadísticas' }, { status: 500 })
  }
}

export { pendingConfirmations }
