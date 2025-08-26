// app/newsletter/confirm/page.tsx
'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from '@/components/Link'

function ConfirmContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'invalid'>('loading')
  const [message, setMessage] = useState('')
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    const confirmSubscription = async () => {
      if (!token) {
        setStatus('invalid')
        setMessage('Token de confirmación no válido')
        return
      }

      try {
        const response = await fetch(`/api/newsletter/confirm-resend?token=${token}`)
        const data = await response.json()

        if (response.ok) {
          setStatus('success')
          setMessage(data.message || '¡Suscripción confirmada correctamente!')
        } else {
          setStatus('error')
          setMessage(data.error || 'Error al confirmar la suscripción')
        }
      } catch (error) {
        setStatus('error')
        setMessage('Error de conexión al confirmar la suscripción')
      }
    }

    confirmSubscription()
  }, [token])

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="text-center">
        {/* Loading */}
        {status === 'loading' && (
          <div className="space-y-6">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600"></div>
            <div className="space-y-2">
              <h1 className="font-headings text-2xl font-bold text-slate-900 dark:text-slate-100">
                Confirmando suscripción...
              </h1>
              <p className="font-body text-slate-600 dark:text-slate-400">
                Por favor espera mientras procesamos tu confirmación.
              </p>
            </div>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="font-headings text-3xl font-bold text-slate-900 dark:text-slate-100">
                Suscripción confirmada
              </h1>
              <p className="font-body text-lg text-slate-600 dark:text-slate-400">
                Ya formas parte de FootballDecoded.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Link
                href="/"
                className="font-body inline-flex items-center justify-center rounded-lg bg-sky-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sky-700"
              >
                Ir al blog
              </Link>
              <Link
                href="/newsletter"
                className="font-body inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Newsletter
              </Link>
            </div>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="font-headings text-3xl font-bold text-slate-900 dark:text-slate-100">
                Error al confirmar
              </h1>
              <p className="font-body text-lg text-slate-600 dark:text-slate-400">{message}</p>
            </div>

            <div className="mx-auto max-w-md rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-700/50 dark:bg-amber-900/20">
              <p className="font-body text-amber-800 dark:text-amber-200">
                Si el problema persiste:{' '}
                <a href="mailto:newsletter@footballdecoded.com" className="underline">
                  newsletter@footballdecoded.com
                </a>
              </p>
            </div>

            <Link
              href="/newsletter"
              className="font-body inline-flex items-center justify-center rounded-lg bg-sky-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sky-700"
            >
              Volver a newsletter
            </Link>
          </div>
        )}

        {/* Invalid Token */}
        {status === 'invalid' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="font-headings text-3xl font-bold text-slate-900 dark:text-slate-100">
                Enlace no válido
              </h1>
              <p className="font-body text-lg text-slate-600 dark:text-slate-400">
                Este enlace ha expirado o no es válido.
              </p>
            </div>

            <Link
              href="/newsletter"
              className="font-body inline-flex items-center justify-center rounded-lg bg-sky-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sky-700"
            >
              Suscribirse de nuevo
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default function NewsletterConfirmPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600"></div>
            <h1 className="font-headings mt-4 text-2xl font-bold text-slate-900 dark:text-slate-100">
              Cargando...
            </h1>
          </div>
        </div>
      }
    >
      <ConfirmContent />
    </Suspense>
  )
}
