import React from 'react'

interface VideoPlayerProps {
  src: string
  alt?: string
  className?: string
}

export default function VideoPlayer({ src, alt, className = '' }: VideoPlayerProps) {
  return (
    <div className={`my-1.5 ${className}`}>
      {}
      <video
        className="h-auto w-full rounded-lg object-contain"
        controls
        muted
        preload="metadata"
        style={{ maxHeight: '800px' }}
      >
        <source src={src} type="video/mp4" />
        {alt && <p>{alt}</p>}
        Tu navegador no soporta el elemento de video.
      </video>
      {alt && (
        <p className="font-helvetica-light mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
          {alt}
        </p>
      )}
    </div>
  )
}
