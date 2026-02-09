'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function updateProgress() {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const total = scrollHeight - clientHeight
      if (total > 0) {
        setProgress((scrollTop / total) * 100)
      }
    }

    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className="fixed top-0 left-0 z-[60] h-1 w-full bg-slate-200/50 dark:bg-slate-700/50">
      <div
        className="h-full bg-sky-600 transition-[width] duration-100 ease-out dark:bg-sky-400"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
