import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'redis'

export async function GET(request: NextRequest) {
  try {
    const client = createClient({
      url: process.env.REDIS_URL || process.env.KV_URL,
    })
    await client.connect()
    
    // Ver todos los suscriptores y sus tokens
    const allEmails = (await client.zRange('newsletter:subscribers', 0, -1)) as string[]
    const subscribers = []
    
    for (const email of allEmails) {
      const key = `newsletter:subscriber:${email}`
      const data = await client.get(key)
      if (data) {
        const subscriber = JSON.parse(data)
        subscribers.push({
          email: subscriber.email,
          confirmed: subscriber.confirmed,
          token: subscriber.confirmationToken?.substring(0, 16) + '...',
          subscribedAt: subscriber.subscribedAt
        })
      }
    }
    
    await client.disconnect()
    
    return NextResponse.json({
      total_subscribers: allEmails.length,
      subscribers: subscribers
    })
    
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}