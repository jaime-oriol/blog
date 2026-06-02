'use client'

import { useEffect, useRef, useState } from 'react'

interface YouTubeEmbedProps {
  src: string
  title?: string
}

export default function YouTubeEmbed({ src, title = 'Video de YouTube' }: YouTubeEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const getVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  const videoId = getVideoId(src)

  useEffect(() => {
    const container = containerRef.current
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true)
          }
        })
      },
      {
        threshold: 0.5,
        rootMargin: '0px',
      }
    )

    if (container) {
      observer.observe(container)
    }

    return () => {
      if (container) {
        observer.unobserve(container)
      }
    }
  }, [isVisible])

  if (!videoId) {
    return (
      <div className="my-8 rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
        <p className="text-red-800 dark:text-red-200">URL de YouTube inválida</p>
      </div>
    )
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${isVisible ? '1' : '0'}&mute=1&rel=0&modestbranding=1`

  return (
    <div ref={containerRef} className="my-8">
      <div
        className="relative overflow-hidden rounded-lg shadow-lg"
        style={{ paddingBottom: '56.25%' }}
      >
        <iframe
          ref={iframeRef}
          className="absolute top-0 left-0 h-full w-full"
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
