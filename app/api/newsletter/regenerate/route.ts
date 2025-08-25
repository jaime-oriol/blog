import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'redis'
import { Resend } from 'resend'
import crypto from 'crypto'

const resend = new Resend(process.env.RESEND_API_KEY)

interface NewsletterSubscriber {
  email: string
  subscribedAt: string
  confirmed: boolean
  confirmationToken?: string
  confirmedAt?: string
  ip?: string
  userAgent?: string
}

// Redis connection
let redis: ReturnType<typeof createClient> | null = null

async function getRedisClient() {
  if (!redis) {
    redis = createClient({
      url: process.env.REDIS_URL || process.env.KV_URL,
    })
    await redis.connect()
  }
  return redis
}

async function getSubscriber(email: string): Promise<NewsletterSubscriber | null> {
  try {
    const client = await getRedisClient()
    const key = `newsletter:subscriber:${email.toLowerCase()}`
    const data = await client.get(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error('Error reading subscriber from Redis:', error)
    return null
  }
}

async function updateSubscriber(subscriber: NewsletterSubscriber): Promise<void> {
  try {
    const client = await getRedisClient()
    const key = `newsletter:subscriber:${subscriber.email.toLowerCase()}`
    await client.set(key, JSON.stringify(subscriber))
  } catch (error) {
    console.error('Error updating subscriber in Redis:', error)
    throw error
  }
}

function generateConfirmationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

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

async function sendConfirmationEmail(email: string, token: string, baseUrl: string) {
  const confirmationUrl = `${baseUrl}/newsletter/confirm?token=${token}`

  try {
    const { data, error } = await resend.emails.send({
      from: 'FootballDecoded Newsletter <newsletter@footballdecoded.com>',
      to: [email],
      subject: '⚽ Confirma tu suscripción a FootballDecoded (Nuevo enlace)',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0ea5e9; font-size: 28px; margin-bottom: 10px;">⚽ FootballDecoded</h1>
            <p style="color: #666; font-size: 16px;">Nuevo enlace de confirmación</p>
          </div>
          
          <div style="background: #f8fafc; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
            <h2 style="color: #334155; font-size: 20px; margin-bottom: 15px;">¡Hola!</h2>
            <p style="margin-bottom: 15px;">Te hemos generado un <strong>nuevo enlace de confirmación</strong> para tu suscripción a FootballDecoded Newsletter.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" 
               style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
              Confirmar suscripción
            </a>
          </div>
          
        </body>
        </html>
      `,
    })

    if (error) {
      throw error
    }
    return data
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 })
    }

    const subscriber = await getSubscriber(email)
    if (!subscriber) {
      return NextResponse.json(
        { error: 'No se encontró suscripción para este email' },
        { status: 404 }
      )
    }

    // Generar nuevo token
    const newToken = generateConfirmationToken()
    
    // Actualizar suscriptor con nuevo token
    const updatedSubscriber = {
      ...subscriber,
      confirmationToken: newToken,
      confirmed: false, // Reset confirmation status
      confirmedAt: undefined
    }

    await updateSubscriber(updatedSubscriber)

    // Enviar nuevo email
    const baseUrl = getBaseUrl(request)
    await sendConfirmationEmail(email, newToken, baseUrl)

    return NextResponse.json({
      message: 'Se ha generado un nuevo token de confirmación. Revisa tu email.',
      email: email
    })

  } catch (error) {
    console.error('Newsletter regenerate token error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}