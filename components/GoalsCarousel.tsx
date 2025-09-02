'use client'

import React, { useState } from 'react'
import Image from '@/components/Image'

interface GoalsCarouselProps {
  basePath: string
  totalGoals: number
  title?: string
}

const GoalsCarousel = ({
  basePath,
  totalGoals,
  title = 'Secuencia de goles',
}: GoalsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Generar array de goles dinámicamente
  const goals = Array.from({ length: totalGoals }, (_, index) => ({
    src: `${basePath}/Gol-${index + 1}.png`,
    alt: `Gol ${index + 1} - Análisis táctico`,
  }))

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const goToPrevious = () => {
    setCurrentIndex(currentIndex === 0 ? goals.length - 1 : currentIndex - 1)
  }

  const goToNext = () => {
    setCurrentIndex(currentIndex === goals.length - 1 ? 0 : currentIndex + 1)
  }

  return (
    <div className="relative my-0.5 w-full">
      {/* Título */}
      {title && (
        <h3 className="font-helvetica-bold mb-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
      )}

      {/* Contenedor principal del carrusel */}
      <div className="relative h-64 overflow-hidden rounded-xl md:h-96 lg:h-[28rem] xl:h-[32rem]">
        {/* Imágenes */}
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {goals.map((goal, index) => (
            <div key={index} className="relative h-full min-w-full">
              <Image
                src={goal.src}
                alt={goal.alt}
                fill
                className="object-cover"
                priority={index === 0}
              />
              {/* Overlay sutil */}
              <div className="absolute inset-0 bg-black/5"></div>
            </div>
          ))}
        </div>

        {/* Controles de navegación - Solo mostrar si hay más de 1 imagen */}
        {goals.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800"
              aria-label="Gol anterior"
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
              className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all duration-200 hover:scale-110 hover:bg-white dark:bg-slate-800/90 dark:hover:bg-slate-800"
              aria-label="Siguiente gol"
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

        {/* Contador de gol actual */}
        <div className="absolute top-4 right-4 rounded-full bg-sky-600/90 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
          {currentIndex + 1} / {goals.length}
        </div>
      </div>
    </div>
  )
}

export default GoalsCarousel
