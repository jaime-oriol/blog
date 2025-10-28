import { LucideIcon, Home, FileText, Images, Mail, User, MessageSquare } from 'lucide-react'

export interface HeaderNavLink {
  href: string
  title: string
  icon: LucideIcon
}

const headerNavLinks: HeaderNavLink[] = [
  { href: '/', title: 'Inicio', icon: Home },
  { href: '/articles', title: 'Artículos', icon: FileText },
  { href: '/visualizations', title: 'Visualizaciones', icon: Images },
  { href: '/newsletter', title: 'Newsletter', icon: Mail },
  { href: '/about', title: 'About', icon: User },
  { href: '/contact', title: 'Contacto', icon: MessageSquare },
]

export default headerNavLinks
