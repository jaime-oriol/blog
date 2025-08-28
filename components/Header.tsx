import siteMetadata from '@/content/siteMetadata'
import headerNavLinks from '@/content/headerNavLinks'
import Image from './Image'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import SectionsNavigation from './SectionsNavigation'
import AuthButton from './AuthButton'

const Header = () => {
  let headerClass = 'flex items-center w-full bg-white dark:bg-slate-900 justify-between py-8'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700'
  }

  return (
    <header className={headerClass}>
      {/* Logo principal */}
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center">
          <Image
            src="/static/images/logo/LOGO.png"
            alt={siteMetadata.headerTitle}
            width={200}
            height={80}
            className="h-20 w-auto"
          />
        </div>
      </Link>

      {/* Navegación principal - tipografía consistente */}
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="hidden items-center gap-x-6 sm:flex lg:gap-x-8">
          {headerNavLinks.map((link) => {
            // Si es el enlace de artículos, usar el dropdown unificado
            if (link.title === 'Artículos') {
              return <SectionsNavigation key="articles" variant="dropdown" />
            }

            // Para el resto de enlaces, tipografía profesional
            return (
              <Link
                key={link.title}
                href={link.href}
                className="font-helvetica-regular text-fd-body font-medium text-slate-700 transition-colors hover:text-sky-700 dark:text-slate-300 dark:hover:text-sky-400"
              >
                {link.title}
              </Link>
            )
          })}
        </div>

        {/* Herramientas de interfaz */}
        <div className="flex items-center space-x-3">
          <AuthButton />
          <SearchButton />
          <ThemeSwitch />
          <MobileNav />
        </div>
      </div>
    </header>
  )
}

export default Header
