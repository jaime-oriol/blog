'use client'

import { useState, useCallback, useEffect } from 'react'
import Image from './Image'

export default function ZoomableImage(props: React.ComponentProps<typeof Image>) {
  const [open, setOpen] = useState(false)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close])

  return (
    <>
      <button
        type="button"
        className="my-1.5 w-full cursor-zoom-in border-0 bg-transparent p-0"
        onClick={() => setOpen(true)}
        aria-label={`Ampliar imagen: ${props.alt || ''}`}
      >
        {/* eslint-disable-next-line jsx-a11y/alt-text */}
        <Image {...props} />
      </button>

      {open && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
        >
          {/* Botón cerrar */}
          <button
            onClick={close}
            className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Cerrar"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Imagen ampliada */}
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <div
            className="relative h-[85vh] w-[92vw] max-w-7xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={props.src}
              alt={props.alt || ''}
              fill
              className="object-contain drop-shadow-2xl"
              sizes="92vw"
              noWrapper
            />
          </div>
        </div>
      )}
    </>
  )
}
