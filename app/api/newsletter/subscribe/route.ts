// app/api/newsletter/subscribe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'redis'
import crypto from 'crypto'
import { sendEmailWithRetry } from '@/lib/resend'

interface NewsletterSubscriber {
  email: string
  subscribedAt: string
  confirmed: boolean
  confirmationToken?: string
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

// Función para obtener la URL base correcta
function getBaseUrl(request: NextRequest): string {
  // En desarrollo
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  // En producción con Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // URL configurada manualmente
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }

  // Fallback usando headers de la request
  const host = request.headers.get('host')
  const protocol = request.headers.get('x-forwarded-proto') || 'https'

  return `${protocol}://${host}`
}

// Funciones Redis para newsletter
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

async function storeSubscriber(subscriber: NewsletterSubscriber): Promise<void> {
  try {
    const client = await getRedisClient()
    const key = `newsletter:subscriber:${subscriber.email.toLowerCase()}`
    await client.set(key, JSON.stringify(subscriber))

    // También almacenar en una lista para estadísticas
    await client.zAdd('newsletter:subscribers', {
      score: Date.now(),
      value: subscriber.email.toLowerCase(),
    })
  } catch (error) {
    console.error('Error storing subscriber in Redis:', error)
    throw error
  }
}

async function getSubscriberStats(): Promise<{ total: number; confirmed: number }> {
  try {
    const client = await getRedisClient()
    const allEmails = (await client.zRange('newsletter:subscribers', 0, -1)) as string[]

    let confirmed = 0
    for (const email of allEmails) {
      const subscriber = await getSubscriber(email)
      if (subscriber?.confirmed) {
        confirmed++
      }
    }

    return { total: allEmails.length, confirmed }
  } catch (error) {
    console.error('Error getting subscriber stats:', error)
    return { total: 0, confirmed: 0 }
  }
}

// Validar email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generar token de confirmación
function generateConfirmationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

// Enviar email de confirmación
async function sendConfirmationEmail(email: string, token: string, baseUrl: string) {
  const confirmationUrl = `${baseUrl}/newsletter/confirm?token=${token}`

  try {
    const response = await sendEmailWithRetry({
      from: 'FootballDecoded <newsletter@footballdecoded.com>',
      to: [email],
      subject: 'Confirma tu suscripción a FootballDecoded',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirma tu suscripción</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0ea5e9; font-size: 28px; margin-bottom: 10px;">⚽ FootballDecoded</h1>
            <p style="color: #666; font-size: 16px;">Confirma tu suscripción a la newsletter</p>
          </div>
          
          <div style="background: #f8fafc; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
            <h2 style="color: #334155; font-size: 20px; margin-bottom: 15px;">¡Hola!</h2>
            <p style="margin-bottom: 15px;">Gracias por suscribirte a <strong>FootballDecoded</strong>.</p>
            <p style="margin-bottom: 20px;">Cada lunes recibirás las <strong>5 noticias más importantes del mundo del fútbol</strong>, contadas con criterio, sin ruido, y con mi análisis personal.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" 
               style="background: #0ea5e9; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; display: inline-block;">
              Confirmar suscripción
            </a>
          </div>
          
          <div style="background: #f1f5f9; border-radius: 6px; padding: 15px; margin-top: 25px;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">
              Si no te has suscrito a esta newsletter, puedes ignorar este email.
            </p>
            <p style="margin: 10px 0 0 0; font-size: 12px; color: #94a3b8;">
              URL de confirmación: ${confirmationUrl}
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">
              FootballDecoded • Análisis del fútbol moderno
            </p>
          </div>
          
        </body>
        </html>
      `,
    })

    return response
  } catch (error) {
    console.error('Failed to send confirmation email:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validaciones básicas
    if (!email) {
      return NextResponse.json({ error: 'Email es requerido' }, { status: 400 })
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Email no válido' }, { status: 400 })
    }

    // Verificar si ya está suscrito
    const existingSubscriber = await getSubscriber(email)
    if (existingSubscriber) {
      if (existingSubscriber.confirmed) {
        return NextResponse.json(
          { message: 'Ya estás suscrito y confirmado en la newsletter' },
          { status: 200 }
        )
      } else {
        // Reenviar email de confirmación
        if (existingSubscriber.confirmationToken) {
          const baseUrl = getBaseUrl(request)
          await sendConfirmationEmail(email, existingSubscriber.confirmationToken, baseUrl)
        }
        return NextResponse.json(
          {
            message:
              'Te hemos reenviado el email de confirmación. Revisa tu bandeja de entrada (y la carpeta de spam por si acaso).',
          },
          { status: 200 }
        )
      }
    }

    // Generar token de confirmación
    const confirmationToken = generateConfirmationToken()

    // Crear nuevo suscriptor
    const newSubscriber: NewsletterSubscriber = {
      email: email.toLowerCase(),
      subscribedAt: new Date().toISOString(),
      confirmed: false,
      confirmationToken,
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    }

    // Guardar en Redis
    await storeSubscriber(newSubscriber)

    // Enviar email de confirmación
    const baseUrl = getBaseUrl(request)
    await sendConfirmationEmail(email, confirmationToken, baseUrl)

    // Respuesta exitosa
    return NextResponse.json({
      message:
        '¡Perfecto! Te hemos enviado un email de confirmación. Revisa tu bandeja de entrada.',
      email: email,
    })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}

// Endpoint GET para obtener estadísticas (opcional, para tu uso)
export async function GET() {
  try {
    const stats = await getSubscriberStats()

    return NextResponse.json({
      total: stats.total,
      confirmed: stats.confirmed,
      pending: stats.total - stats.confirmed,
    })
  } catch (error) {
    console.error('Error getting newsletter stats:', error)
    return NextResponse.json({ error: 'Error obteniendo estadísticas' }, { status: 500 })
  }
}
