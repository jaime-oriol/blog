import { Resend } from 'resend'

let resendInstance: Resend | null = null

export function getResendClient(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY no configurado')
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

export async function sendEmailWithRetry(emailData: any, maxRetries: number = 3): Promise<any> {
  const resend = getResendClient()

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await resend.emails.send(emailData)

      if (response.error) {
        throw response.error
      }

      return response
    } catch (error: any) {
      const isRateLimit = error?.name === 'rate_limit_exceeded' || error?.statusCode === 429
      const isLastAttempt = attempt === maxRetries

      if (isRateLimit && !isLastAttempt) {
        // Esperar tiempo exponencial: 1s, 2s, 4s
        const waitTime = Math.pow(2, attempt - 1) * 1000
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        continue
      }

      // Si no es rate limit o es el último intento, lanzar error
      throw error
    }
  }
}

export async function createContactWithRetry(
  contactData: any,
  maxRetries: number = 3
): Promise<any> {
  const resend = getResendClient()

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await resend.contacts.create(contactData)

      if (response.error) {
        throw response.error
      }

      return response
    } catch (error: any) {
      const isRateLimit = error?.name === 'rate_limit_exceeded' || error?.statusCode === 429
      const isLastAttempt = attempt === maxRetries

      if (isRateLimit && !isLastAttempt) {
        const waitTime = Math.pow(2, attempt - 1) * 1000
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        continue
      }

      throw error
    }
  }
}

export async function updateContactWithRetry(
  updateData: any,
  maxRetries: number = 3
): Promise<any> {
  const resend = getResendClient()

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await resend.contacts.update(updateData)

      if (response.error) {
        throw response.error
      }

      return response
    } catch (error: any) {
      const isRateLimit = error?.name === 'rate_limit_exceeded' || error?.statusCode === 429
      const isLastAttempt = attempt === maxRetries

      if (isRateLimit && !isLastAttempt) {
        const waitTime = Math.pow(2, attempt - 1) * 1000
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        continue
      }

      throw error
    }
  }
}

export async function listContactsWithRetry(listData: any, maxRetries: number = 3): Promise<any> {
  const resend = getResendClient()

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await resend.contacts.list(listData)

      if (response.error) {
        throw response.error
      }

      return response
    } catch (error: any) {
      const isRateLimit = error?.name === 'rate_limit_exceeded' || error?.statusCode === 429
      const isLastAttempt = attempt === maxRetries

      if (isRateLimit && !isLastAttempt) {
        const waitTime = Math.pow(2, attempt - 1) * 1000
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        continue
      }

      throw error
    }
  }
}
