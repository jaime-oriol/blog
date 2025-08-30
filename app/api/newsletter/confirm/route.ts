// app/api/newsletter/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'redis'

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

// Funciones Redis
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

async function findSubscriberByToken(token: string): Promise<NewsletterSubscriber | null> {
  try {
    const client = await getRedisClient()
    const allEmails = (await client.zRange('newsletter:subscribers', 0, -1)) as string[]

    for (const email of allEmails) {
      const subscriber = await getSubscriber(email)
      if (subscriber?.confirmationToken === token) {
        return subscriber
      }
    }

    return null
  } catch (error) {
    console.error('Error finding subscriber by token:', error)
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token de confirmación requerido' }, { status: 400 })
    }

    // Buscar suscriptor por token
    const subscriber = await findSubscriberByToken(token)

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Token de confirmación no válido o ya utilizado' },
        { status: 404 }
      )
    }

    // Si ya está confirmado - permitir reconfirmación para testing
    if (subscriber.confirmed) {
      return NextResponse.json({
        message: '¡Suscripción confirmada! Tu email ya estaba confirmado anteriormente.',
        email: subscriber.email,
        status: 'already_confirmed',
      })
    }

    // Confirmar suscripción
    const updatedSubscriber = {
      ...subscriber,
      confirmed: true,
      confirmedAt: new Date().toISOString(),
      confirmationToken: undefined, // Eliminar el token usado
    }

    // Actualizar en Redis
    await updateSubscriber(updatedSubscriber)

    // Respuesta de éxito
    return NextResponse.json({
      message: '¡Suscripción confirmada correctamente! Recibirás la newsletter periódicamente.',
      email: subscriber.email,
    })
  } catch (error) {
    console.error('Newsletter confirmation error:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
