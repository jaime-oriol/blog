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
        className="h-auto w-full rounded-lg object-contain"
        controls
        muted
        playsInline
        preload="auto"
        style={{ maxHeight: '800px', backgroundColor: '#000' }}
        src={src}
      >
        Tu navegador no soporta el elemento de video.
      </video>
    </div>
  )
}
