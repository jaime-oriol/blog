'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryItem {
  src: string
  alt: string
  title: string
  category: 'Pass Network' | 'Shot Map' | 'Radar' | 'Comparativa' | 'Análisis' | 'Video' | 'Otro'
  type?: 'image' | 'video'
}

const getCategoryColor = (category: GalleryItem['category']) => {
  const colors = {
    'Pass Network': 'bg-sky-500/90 text-white',
    'Shot Map': 'bg-emerald-500/90 text-white',
    Radar: 'bg-purple-500/90 text-white',
    Comparativa: 'bg-orange-500/90 text-white',
    Análisis: 'bg-indigo-500/90 text-white',
    Video: 'bg-rose-500/90 text-white',
    Otro: 'bg-slate-500/90 text-white',
  }
  return colors[category]
}

const firstRow: GalleryItem[] = [
  {
    src: '/static/images/articles/villareal/J8-RM/pn1.png',
    alt: 'Pass Network Real Madrid vs Villareal',
    title: 'Pass Network',
    category: 'Pass Network',
  },
  {
    src: '/static/images/articles/villareal/J8-RM/sm.png',
    alt: 'Shot Map Real Madrid vs Villareal',
    title: 'Shot Map Partido',
    category: 'Shot Map',
  },
  {
    src: '/static/images/articles/atm/sorloth/sorloth_shotmap_24-25.png',
    alt: 'Shot Map individual Alexander Sørloth temporada 24/25',
    title: 'Shot Map Individual',
    category: 'Shot Map',
  },
]

const videoRow: GalleryItem[] = [
  {
    src: '/static/images/articles/analytics-lab/espacio/voronoi_clip.mp4',
    alt: 'Diagrama de Voronoi dinámico aplicado a un partido real',
    title: 'Voronoi Dinámico',
    category: 'Video',
    type: 'video',
  },
  {
    src: '/static/images/articles/analytics-lab/espacio/ppcf_clip.mp4',
    alt: 'Pitch Control (PPCF) dinámico aplicado a un partido real',
    title: 'Pitch Control Dinámico',
    category: 'Video',
    type: 'video',
  },
]

const restRows: GalleryItem[] = [
  {
    src: '/static/images/articles/atm/sorloth/sorloth_individual_COMBINED_2324.png',
    alt: 'Radar estadístico Alexander Sørloth temporada 23/24',
    title: 'Radar Individual',
    category: 'Radar',
  },
  {
    src: '/static/images/articles/atm/sorloth/sorloth_vs_haaland_COMBINED.png',
    alt: 'Comparación estadística Sørloth vs Haaland',
    title: 'Comparativo Delanteros',
    category: 'Comparativa',
  },
  {
    src: '/static/images/articles/atm/J4-vill/llorente.png',
    alt: 'Estadisticas, mapa de pases y acciones Llorente vs Villareal',
    title: 'Player Report',
    category: 'Comparativa',
  },
  {
    src: '/static/images/articles/atm/sorloth/scatter_xg_goals_total.png',
    alt: 'Scatter plot xG vs Goles',
    title: 'Scatter Plot',
    category: 'Análisis',
  },
  {
    src: '/static/images/articles/villareal/J8-RM/pf.png',
    alt: 'Pass Flow Real Madrid vs Villareal',
    title: 'Pass Flow',
    category: 'Pass Network',
  },
  {
    src: '/static/images/articles/villareal/J8-RM/ph.png',
    alt: 'Pass Hull Real Madrid vs Villareal',
    title: 'Pass Hull',
    category: 'Pass Network',
  },
]

const images: GalleryItem[] = [...firstRow, ...videoRow, ...restRows]

export default function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = useCallback(() => {
    setSelectedImage(null)
    document.body.style.overflow = 'unset'
  }, [])

  const goToPrevious = useCallback(() => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)
    }
  }, [selectedImage])

  const goToNext = useCallback(() => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === images.length - 1 ? 0 : selectedImage + 1)
    }
  }, [selectedImage])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowLeft') goToPrevious()
      if (e.key === 'ArrowRight') goToNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, closeLightbox, goToPrevious, goToNext])

  const renderCard = (image: GalleryItem, index: number) => {
    const isVideo = image.type === 'video'
    return (
      <div
        key={index}
        className={`group relative overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-sky-500/20 dark:bg-slate-800 dark:hover:shadow-sky-400/20 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} `}
        style={{ transitionDelay: `${index * 50}ms` }}
      >
        <div
          className="relative aspect-video cursor-pointer overflow-hidden"
          onClick={() => openLightbox(index)}
          role="button"
          tabIndex={0}
          aria-label={`Abrir ${image.title}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              openLightbox(index)
            }
          }}
        >
          {isVideo ? (
            <video
              src={image.src}
              muted
              loop
              autoPlay
              playsInline
              className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
            />
          ) : (
            <>
              {!imageLoaded[index] && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800" />
              )}
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className={`object-contain p-4 transition-all duration-500 group-hover:scale-110 group-hover:p-2 ${imageLoaded[index] ? 'opacity-100' : 'opacity-0'} `}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                onLoad={() => setImageLoaded((prev) => ({ ...prev, [index]: true }))}
              />
            </>
          )}
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div>
              <h3 className="text-lg font-bold text-white drop-shadow-lg">{image.title}</h3>
              <p className="text-sm text-white/90">{image.alt}</p>
            </div>
          </div>
        </div>
        <div className="h-1 w-0 bg-gradient-to-r from-sky-500 to-purple-500 transition-all duration-500 group-hover:w-full" />
      </div>
    )
  }

  return (
    <>
      {/* Fila 1: 3 imágenes */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {firstRow.map((image, i) => renderCard(image, i))}
      </div>

      {/* Fila 2: 2 vídeos */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {videoRow.map((image, i) => renderCard(image, firstRow.length + i))}
      </div>

      {/* Filas 3-4: resto */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {restRows.map((image, i) => renderCard(image, firstRow.length + videoRow.length + i))}
      </div>

      {/* Lightbox Modal mejorado */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeLightbox}
          role="button"
          tabIndex={0}
          aria-label="Cerrar galería (presiona Escape o haz clic)"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              closeLightbox()
            }
          }}
          style={{
            animation: 'fadeIn 0.2s ease-out',
          }}
        >
          {/* Botón cerrar */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/10 p-3 backdrop-blur-md transition-all hover:rotate-90 hover:bg-white/20 sm:top-8 sm:right-8"
            aria-label="Cerrar galería"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Contenedor de imagen e info */}
          <div
            className="flex flex-col items-center gap-4"
            onClick={(e) => e.stopPropagation()}
            role="button"
            tabIndex={0}
            aria-label="Contenido de la imagen"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.stopPropagation()
              }
            }}
          >
            {/* Contenido sin overlay */}
            <div className="relative h-[75vh] w-[90vw] max-w-6xl">
              {images[selectedImage].type === 'video' ? (
                <video
                  src={images[selectedImage].src}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="h-full w-full object-contain drop-shadow-2xl"
                />
              ) : (
                <Image
                  src={images[selectedImage].src}
                  alt={images[selectedImage].alt}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="90vw"
                  priority
                />
              )}
            </div>

            {/* Info FUERA de la imagen */}
            <div className="text-center">
              <h3 className="text-xl font-bold text-white drop-shadow-lg">
                {images[selectedImage].title}
              </h3>
              <p className="text-sm text-white/80">{images[selectedImage].alt}</p>
            </div>
          </div>

          {/* Botón anterior */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToPrevious()
            }}
            className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/10 p-4 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20 sm:left-8"
            aria-label="Imagen anterior"
          >
            <ChevronLeft className="h-8 w-8 text-white" />
          </button>

          {/* Botón siguiente */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              goToNext()
            }}
            className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/10 p-4 backdrop-blur-md transition-all hover:scale-110 hover:bg-white/20 sm:right-8"
            aria-label="Siguiente imagen"
          >
            <ChevronRight className="h-8 w-8 text-white" />
          </button>

          {/* Contador */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-4 py-2 text-white backdrop-blur-md">
            {selectedImage + 1} / {images.length}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  )
}
