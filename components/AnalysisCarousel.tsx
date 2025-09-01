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
  autoPlay = false,
  showDots = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(autoPlay)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile for auto-play behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-play functionality - paused on mobile for better control
  useEffect(() => {
    if (!isAutoPlay || images.length <= 1 || isMobile) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
    }, 3000)

    return () => clearInterval(interval)
  }, [isAutoPlay, images.length, isMobile])

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
    <div className="w-full">
      {/* Título y descripción */}
      {(title || description) && (
        <div className="mb-6 text-center">
          {title && (
            <h3 className="font-helvetica-bold mb-2 text-xl font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h3>
          )}
          {description && (
            <p className="font-helvetica-light text-sm text-slate-600 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Contenedor principal del carrusel - optimizado para ratio 2:1 de las imágenes tácticas */}
      <div className="relative w-full">
        <div
          className="relative h-48 overflow-hidden sm:h-64 md:h-72 lg:h-80 xl:h-[400px]"
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
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                />
              </div>
            ))}
          </div>

          {/* Controles de navegación - mejorados para mobile */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute top-3/4 left-1 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-white md:top-1/2 md:left-4 md:p-3 dark:bg-slate-800/90 dark:hover:bg-slate-800"
                style={{ minWidth: '36px', minHeight: '36px' }} // Smaller on mobile
                aria-label="Imagen anterior"
              >
                <svg
                  className="h-4 w-4 text-slate-800 md:h-5 md:w-5 dark:text-slate-200"
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
                className="absolute top-3/4 right-1 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all duration-200 hover:scale-105 hover:bg-white md:top-1/2 md:right-4 md:p-3 dark:bg-slate-800/90 dark:hover:bg-slate-800"
                style={{ minWidth: '36px', minHeight: '36px' }} // Smaller on mobile
                aria-label="Siguiente imagen"
              >
                <svg
                  className="h-4 w-4 text-slate-800 md:h-5 md:w-5 dark:text-slate-200"
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

          {/* Contador de imágenes - más pequeño y más abajo en mobile */}
          {images.length > 1 && (
            <div className="absolute right-2 bottom-1 rounded-full bg-black/80 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm md:right-3 md:bottom-3 md:px-3 md:py-1.5 md:text-sm">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalysisCarousel
