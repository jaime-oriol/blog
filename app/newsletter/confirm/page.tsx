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
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
              <svg className="h-10 w-10 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="space-y-4">
              <h1 className="font-headings text-3xl font-bold text-slate-900 dark:text-slate-100">
                ¡Suscripción confirmada!
              </h1>
              <p className="font-body text-lg text-slate-600 dark:text-slate-400">
                Perfecto, ya formas parte de la comunidad FootballDecoded.
              </p>
            </div>

            <div className="mx-auto max-w-md rounded-xl border border-sky-200 bg-sky-50 p-6 dark:border-sky-700/50 dark:bg-sky-900/20">
              <h2 className="font-headings mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">
                ¿Qué viene ahora?
              </h2>
              <p className="font-body text-slate-600 dark:text-slate-400">
                Cada <strong>lunes por la mañana</strong> recibirás las 5 noticias más importantes
                del mundo del fútbol, contadas con criterio y con mi análisis personal.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
              <Link
                href="/"
                className="font-body inline-flex items-center justify-center rounded-lg bg-sky-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                Explorar el blog
              </Link>
              <Link
                href="/newsletter"
                className="font-body inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Saber más sobre la newsletter
              </Link>
            </div>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="space-y-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <svg className="h-10 w-10 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="space-y-4">
              <h1 className="font-headings text-3xl font-bold text-slate-900 dark:text-slate-100">
                Error al confirmar
              </h1>
              <p className="font-body text-lg text-slate-600 dark:text-slate-400">{message}</p>
            </div>

            <div className="mx-auto max-w-md rounded-xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-700/50 dark:bg-amber-900/20">
              <p className="font-body text-amber-800 dark:text-amber-200">
                Si el problema persiste, puedes contactarme en{' '}
                <a href="mailto:newsletter@footballdecoded.com" className="font-medium underline">
                  newsletter@footballdecoded.com
                </a>
              </p>
            </div>

            <Link
              href="/newsletter"
              className="font-body inline-flex items-center justify-center rounded-lg bg-sky-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Volver a la newsletter
            </Link>
          </div>
        )}

        {/* Invalid Token */}
        {status === 'invalid' && (
          <div className="space-y-8">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/20">
              <svg className="h-10 w-10 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            <div className="space-y-4">
              <h1 className="font-headings text-3xl font-bold text-slate-900 dark:text-slate-100">
                Enlace no válido
              </h1>
              <p className="font-body text-lg text-slate-600 dark:text-slate-400">
                Este enlace de confirmación no es válido o ha expirado.
              </p>
            </div>

            <Link
              href="/newsletter"
              className="font-body inline-flex items-center justify-center rounded-lg bg-sky-600 px-6 py-3 font-medium text-white transition-colors hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
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
