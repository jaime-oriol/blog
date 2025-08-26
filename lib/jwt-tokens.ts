import crypto from 'crypto'

const SECRET_KEY = process.env.NEXTAUTH_SECRET || 'fallback-secret-key-for-jwt-tokens'

interface TokenPayload {
  email: string
  iat: number
  exp: number
}

function base64UrlEncode(str: Buffer): string {
  return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function base64UrlDecode(str: string): Buffer {
  str += new Array(5 - (str.length % 4)).join('=')
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64')
}

function sign(payload: string): string {
  return crypto
    .createHmac('sha256', SECRET_KEY)
    .update(payload)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export function generateConfirmationToken(email: string): string {
  const now = Math.floor(Date.now() / 1000)
  const expiry = now + 24 * 60 * 60 // 24 horas

  const payload: TokenPayload = {
    email: email.toLowerCase(),
    iat: now,
    exp: expiry,
  }

  const header = { alg: 'HS256', typ: 'JWT' }

  const encodedHeader = base64UrlEncode(Buffer.from(JSON.stringify(header)))
  const encodedPayload = base64UrlEncode(Buffer.from(JSON.stringify(payload)))

  const signature = sign(`${encodedHeader}.${encodedPayload}`)

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export function verifyConfirmationToken(token: string): {
  valid: boolean
  email?: string
  expired?: boolean
} {
  try {
    const parts = token.split('.')

    if (parts.length !== 3) {
      return { valid: false }
    }

    const [encodedHeader, encodedPayload, signature] = parts

    const expectedSignature = sign(`${encodedHeader}.${encodedPayload}`)

    if (signature !== expectedSignature) {
      return { valid: false }
    }

    const payload: TokenPayload = JSON.parse(base64UrlDecode(encodedPayload).toString())

    const now = Math.floor(Date.now() / 1000)

    if (payload.exp < now) {
      return { valid: false, expired: true, email: payload.email }
    }

    return { valid: true, email: payload.email }
  } catch (error) {
    console.error('Error verifying JWT token:', error)
    return { valid: false }
  }
}
