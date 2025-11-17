import React from 'react'

interface VideoPlayerProps {
  src: string
  className?: string
}

export default function VideoPlayer({ src, className = '' }: VideoPlayerProps) {
  return (
    <div className={`my-1.5 ${className}`}>
      {}
      <video
        className="h-auto w-full rounded-lg"
        controls
        muted
        playsInline
        preload="auto"
        style={{ maxHeight: '500px', objectFit: 'cover' }}
        src={src}
      >
        Tu navegador no soporta el elemento de video.
      </video>
    </div>
  )
}
