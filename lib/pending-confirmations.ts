export const pendingConfirmations = new Map<
  string,
  {
    email: string
    token: string
    contactId?: string
    createdAt: number
  }
>()
