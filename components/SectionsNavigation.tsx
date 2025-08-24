'use client'

import { useState } from 'react'
import Link from '@/components/Link'
import { usePathname } from 'next/navigation'

interface Section {
  href: string
  title: string
  description: string
  icon: React.ReactNode | null
}

const sections: Section[] = [
  {
    href: '/blog',
    title: 'Todos los artículos',
    description: 'Vista completa',
    icon: null,
  },
  {
    href: '/blog/player-decoded',
    title: 'Player Decoded',
    description: 'Análisis profundo de jugadores individuales, perfiles tácticos y scouting avanzado',
    icon: null,
  },
  {
    href: '/blog/match-analysis',
    title: 'Match Analysis',
    description: 'Análisis táctico detallado de partidos específicos y dinámicas de juego',
    icon: null,
  },
  {
    href: '/blog/team-architecture',
    title: 'Team Architecture',
    description: 'Estructura de equipos, sistemas tácticos y diseño estratégico',
    icon: null,
  },
]

interface SectionsNavigationProps {
  variant: 'dropdown' | 'bar' | 'sidebar'
}

export default function SectionsNavigation({ variant }: SectionsNavigationProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  if (variant === 'dropdown') {
    return (
      <div
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        {/* Trigger Button */}
        <button className="font-body flex items-center font-medium text-slate-700 transition-colors hover:text-sky-700 dark:text-slate-300 dark:hover:text-sky-400">
          Artículos
          <svg
            className={`ml-1 h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute top-full left-0 mt-2 w-auto transform transition-all duration-200 ${
            isOpen
              ? 'visible z-[9999] translate-y-0 opacity-100'
              : 'invisible z-[-1] -translate-y-2 opacity-0'
          }`}
          style={{ zIndex: isOpen ? 9999 : -1 }}
        >
          {/* Arrow pointer */}
          <div className="absolute -top-1 left-4 h-2 w-2 rotate-45 border-t border-l border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"></div>

          {/* Menu content */}
          <div className="rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
            <div className="p-2">
              {/* Horizontal layout (1 fila) */}
              <div className="flex space-x-1">
                {sections.map((section) => (
                  <Link
                    key={section.href}
                    href={section.href}
                    className="flex min-w-[120px] flex-col items-center rounded-lg p-3 text-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
                  >
                    <div className="font-headings text-sm font-medium text-slate-900 dark:text-slate-100">
                      {section.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'bar') {
    return (
      <div className="w-full border-b border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 xl:px-0">
          <nav className="scrollbar-hide flex space-x-8 overflow-x-auto" aria-label="Secciones">
            {sections.map((section) => {
              const isActive = pathname === section.href
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className={`group relative flex min-w-0 flex-col py-4 text-center transition-colors duration-200 ${
                    isActive
                      ? 'text-sky-700 dark:text-sky-400'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <span className="font-headings text-sm font-medium whitespace-nowrap lg:text-base">
                    {section.title}
                  </span>
                  <div
                    className={`absolute right-0 bottom-0 left-0 h-0.5 rounded-full transition-all duration-200 ${
                      isActive
                        ? 'bg-sky-500 opacity-100'
                        : 'bg-transparent opacity-0 group-hover:bg-slate-300 group-hover:opacity-50 dark:group-hover:bg-slate-600'
                    }`}
                  />
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    )
  }

  // variant === 'sidebar'
  return (
    <aside className="w-64 flex-shrink-0">
      <div className="sticky top-24 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="font-headings mb-6 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Secciones
        </h3>
        <nav className="space-y-2">
          {sections.map((section) => {
            const isActive = pathname === section.href
            return (
              <Link
                key={section.href}
                href={section.href}
                className={`group flex items-start rounded-lg px-3 py-3 text-sm transition-colors ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 dark:bg-sky-900/20 dark:text-sky-300'
                    : 'text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="font-headings truncate font-medium">{section.title}</div>
                  <div className="font-body mt-1 text-xs text-slate-500 dark:text-slate-400">
                    {section.description}
                  </div>
                </div>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
