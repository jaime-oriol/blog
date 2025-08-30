'use client'

import React, { useState, useEffect } from 'react'
import Image from '@/components/Image'

interface AnalysisCarouselProps {
  basePath: string
  images: string[]
  title?: string
  description?: string
  autoPlay?: boolean
  showDots?: boolean
}

const AnalysisCarousel: React.FC<AnalysisCarouselProps> = ({
  basePath,
  images,
  title,
  description,
  autoPlay = true,
  showDots = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlay || images.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
    }, 3000) // 3 segundos por imagen para análisis táctico

    return () => clearInterval(interval)
  }, [isAutoPlay, images.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const handleMouseEnter = () => setIsAutoPlay(false)
  const handleMouseLeave = () => setIsAutoPlay(autoPlay)

  if (!images || images.length === 0) {
    return null
  }

  return (
    <div className="my-8 w-full">
      {/* Título y descripción */}
      {(title || description) && (
        <div className="mb-4 text-center">
          {title && (
            <h3 className="font-helvetica-bold text-xl font-semibold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="font-helvetica-light mt-2 text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Contenedor principal del carrusel */}
      <div className="relative mx-auto max-w-4xl">
        <div
          className="relative h-64 overflow-hidden rounded-xl bg-slate-50 md:h-80 lg:h-96 dark:bg-slate-800"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Imágenes */}
          <div
            className="flex h-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((imageName, index) => (
              <div key={index} className="relative h-full min-w-full">
                <Image
                  src={`${basePath}/${imageName}`}
                  alt={`Análisis táctico - paso ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>

          {/* Controles de navegación */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-all duration-200 hover:bg-white/95 dark:bg-slate-800/80 dark:hover:bg-slate-800/95"
                aria-label="Imagen anterior"
              >
                <svg
                  className="h-5 w-5 text-slate-800 dark:text-slate-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={goToNext}
                className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-lg transition-all duration-200 hover:bg-white/95 dark:bg-slate-800/80 dark:hover:bg-slate-800/95"
                aria-label="Siguiente imagen"
              >
                <svg
                  className="h-5 w-5 text-slate-800 dark:text-slate-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}

          {/* Contador de imágenes */}
          {images.length > 1 && (
            <div className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-sm text-white backdrop-blur-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Indicadores (dots) */}
        {showDots && images.length > 1 && (
          <div className="flex justify-center space-x-2 pt-4">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 w-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'scale-110 bg-sky-600 dark:bg-sky-400'
                    : 'bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500'
                }`}
                aria-label={`Ir a la imagen ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AnalysisCarousel
