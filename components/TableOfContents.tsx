'use client'

import { useEffect, useState } from 'react'

interface TocItem {
  value: string
  url: string
  depth: number
}

interface TableOfContentsProps {
  toc: TocItem[]
}

export default function TableOfContents({ toc }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    const headings = toc
      .map((item) => document.getElementById(item.url.replace('#', '')))
      .filter(Boolean) as HTMLElement[]

    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    headings.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [toc])

  if (toc.length === 0) return null

  // Solo mostrar h2 y h3
  const filtered = toc.filter((item) => item.depth >= 2 && item.depth <= 3)
  if (filtered.length < 2) return null

  return (
    <nav className="fixed top-24 right-8 hidden max-h-[calc(100vh-8rem)] w-52 overflow-y-auto 2xl:block">
      <p className="font-helvetica-bold mb-3 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500">
        Contenido
      </p>
      <ul className="space-y-1.5 border-l border-slate-200 dark:border-slate-700">
        {filtered.map((item) => {
          const id = item.url.replace('#', '')
          const isActive = activeId === id
          const isH3 = item.depth === 3

          return (
            <li key={item.url}>
              <a
                href={item.url}
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`block border-l-2 py-1 text-xs leading-snug transition-colors ${
                  isH3 ? 'pl-5' : 'pl-3'
                } ${
                  isActive
                    ? 'border-sky-600 font-medium text-sky-700 dark:border-sky-400 dark:text-sky-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                {item.value}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
