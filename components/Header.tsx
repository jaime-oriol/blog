'use client'

import siteMetadata from '@/content/siteMetadata'
import headerNavLinks from '@/content/headerNavLinks'
import Image from './Image'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import SectionsNavigation from './SectionsNavigation'
import AuthButton from './AuthButton'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

const Header = () => {
  const { theme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const headerClass = [
    'sticky top-0 z-40 flex w-full items-center justify-between',
    'bg-white/80 px-3 py-5 backdrop-blur-md transition-shadow duration-300 sm:px-0 sm:py-4 dark:bg-slate-900/80',
    scrolled
      ? 'border-b border-slate-200/70 shadow-sm dark:border-slate-700/70'
      : 'border-b border-transparent',
  ].join(' ')

  const isDark =
    mounted && (resolvedTheme === 'dark' || (theme === 'system' && resolvedTheme === 'dark'))
  const logoSrc = isDark
    ? '/static/images/logo/Logo-color-secundario.png'
    : '/static/images/logo/LOGO.png'

  return (
    <header className={headerClass}>
      {/* Logo principal */}
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-end">
          <Image
            src={logoSrc}
            alt={siteMetadata.headerTitle}
            width={2351}
            height={600}
            className="h-auto w-36 sm:w-44 lg:w-52"
            priority
          />
        </div>
      </Link>

      {/* Navegación principal - tipografía consistente */}
      <div className="flex items-center space-x-3 leading-5 sm:-mr-6 sm:space-x-4">
        <div className="hidden items-center gap-x-4 sm:flex lg:gap-x-6">
          {headerNavLinks.map((link) => {
            // Si es el enlace de artículos, usar el dropdown unificado
            if (link.title === 'Artículos') {
              return <SectionsNavigation key="articles" variant="dropdown" />
            }

            const isActive = pathname === link.href
            const Icon = link.icon

            // Para el resto de enlaces, tipografía profesional con iconos
            return (
              <Link
                key={link.title}
                href={link.href}
                className={`group font-helvetica-regular text-fd-body relative flex items-center gap-2 font-medium transition-colors duration-300 ${
                  isActive
                    ? 'text-fd dark:text-fd-300'
                    : 'hover:text-fd dark:hover:text-fd-300 text-slate-700 dark:text-slate-300'
                } `}
              >
                <Icon className="h-4 w-4" />
                {link.title}
                <span
                  className={`bg-fd dark:bg-fd-300 absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'} `}
                />
              </Link>
            )
          })}
        </div>

        {/* Herramientas de interfaz */}
        <div className="flex items-center space-x-3">
          <div className="hidden sm:block">
            <AuthButton />
          </div>
          <SearchButton />
          <ThemeSwitch />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
