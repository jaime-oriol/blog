import { Resend } from 'resend'

let resendInstance: Resend | null = null

// Types for Resend API
interface EmailData {
  from: string
  to: string | string[]
  subject: string
  html?: string
  text?: string
  reply_to?: string
}

interface ContactData {
  email: string
  first_name?: string
  last_name?: string
  unsubscribed?: boolean
  audience_id?: string
}

interface UpdateContactData {
  id: string
  audienceId?: string
  unsubscribed?: boolean
  first_name?: string
  last_name?: string
}

interface ListContactsData {
  audience_id?: string
}

interface ResendResponse<T = unknown> {
  data?: T
  error?: {
    name?: string
    message: string
    statusCode?: number
  }
}

interface ResendError {
  name?: string
  message: string
  statusCode?: number
}

export function getResendClient(): Resend {
  if (!resendInstance) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY no configurado')
    }
    resendInstance = new Resend(process.env.RESEND_API_KEY)
  }
  return resendInstance
}

export async function sendEmailWithRetry(
  emailData: EmailData,
  maxRetries: number = 3
): Promise<ResendResponse> {
  const resend = getResendClient()

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await resend.emails.send(emailData)

      if (response.error) {
        throw response.error
      }

      return response
    } catch (error: unknown) {
      const resendError = error as ResendError
      const isRateLimit =
        resendError?.name === 'rate_limit_exceeded' || resendError?.statusCode === 429
      const isLastAttempt = attempt === maxRetries

      if (isRateLimit && !isLastAttempt) {
        // Esperar tiempo exponencial: 1s, 2s, 4s
        const waitTime = Math.pow(2, attempt - 1) * 1000
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        continue
      }

      // Si no es rate limit o es el último intento, lanzar error
      throw resendError
    }
  }
}

export async function createContactWithRetry(
  contactData: ContactData,
  maxRetries: number = 3
): Promise<ResendResponse> {
  const resend = getResendClient()

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await resend.contacts.create(contactData)

      if (response.error) {
        throw response.error
      }

      return response
    } catch (error: unknown) {
      const resendError = error as ResendError
      const isRateLimit =
        resendError?.name === 'rate_limit_exceeded' || resendError?.statusCode === 429
      const isLastAttempt = attempt === maxRetries

      if (isRateLimit && !isLastAttempt) {
        const waitTime = Math.pow(2, attempt - 1) * 1000
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        continue
      }

      throw resendError
    }
  }
}

export async function updateContactWithRetry(
  updateData: UpdateContactData,
  maxRetries: number = 3
): Promise<ResendResponse> {
  const resend = getResendClient()

  console.log(`[UPDATE] Starting update for contact:`, {
    contactId: updateData.id,
    audienceId: updateData.audienceId,
    unsubscribed: updateData.unsubscribed,
    maxRetries,
  })

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[UPDATE] Attempt ${attempt}/${maxRetries} for contact ${updateData.id}`)

      const response = await resend.contacts.update(updateData)

      console.log(`[UPDATE] Raw response for contact ${updateData.id}:`, {
        attempt,
        hasError: !!response.error,
        errorMessage: response.error?.message,
        data: response.data,
      })

      if (response.error) {
        console.error(`[UPDATE] API returned error for contact ${updateData.id}:`, response.error)

        // Don't throw immediately, let the retry logic handle it unless it's the last attempt
        if (attempt === maxRetries) {
          throw response.error
        }

        const waitTime = Math.pow(2, attempt - 1) * 1000
        console.log(`[UPDATE] API error occurred, waiting ${waitTime}ms before retry...`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        continue
      }

      console.log(`[UPDATE] Successfully updated contact ${updateData.id} on attempt ${attempt}`)
      return response
    } catch (error: unknown) {
      const resendError = error as ResendError
      const isRateLimit =
        resendError?.name === 'rate_limit_exceeded' || resendError?.statusCode === 429
      const isLastAttempt = attempt === maxRetries

      console.error(`[UPDATE] Exception in attempt ${attempt} for contact ${updateData.id}:`, {
        errorName: resendError?.name,
        statusCode: resendError?.statusCode,
        message: resendError?.message,
        isRateLimit,
        isLastAttempt,
      })

      if (isRateLimit && !isLastAttempt) {
        const waitTime = Math.pow(2, attempt - 1) * 1000
        console.log(`[UPDATE] Rate limit hit, waiting ${waitTime}ms before retry...`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        continue
      }

      if (isLastAttempt) {
        console.error(`[UPDATE] All attempts failed for contact ${updateData.id}`)
        throw resendError
      }

      // For other errors, still wait before retry
      const waitTime = Math.pow(2, attempt - 1) * 1000
      console.log(`[UPDATE] Non-rate-limit error, waiting ${waitTime}ms before retry...`)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }
  }
}

export async function listContactsWithRetry(
  listData: ListContactsData,
  maxRetries: number = 3
): Promise<ResendResponse> {
  const resend = getResendClient()

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await resend.contacts.list(listData)

      if (response.error) {
        throw response.error
      }

      return response
    } catch (error: unknown) {
      const resendError = error as ResendError
      const isRateLimit =
        resendError?.name === 'rate_limit_exceeded' || resendError?.statusCode === 429
      const isLastAttempt = attempt === maxRetries

      if (isRateLimit && !isLastAttempt) {
        const waitTime = Math.pow(2, attempt - 1) * 1000
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        continue
      }

      throw resendError
    }
  }
}
