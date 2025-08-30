import { genPageMetadata } from 'app/seo'
import PhotoCarousel from '@/components/PhotoCarousel'
import BioSection from '@/components/BioSection'

export const metadata = genPageMetadata({ title: 'About' })

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-2 sm:px-6 xl:max-w-5xl xl:px-0">
      {/* Header de la sección - consistente con otras páginas */}
      <div className="mb-8 text-left">
        <h1 className="font-headings mb-5 text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl dark:text-slate-100">
          Sobre mí
        </h1>
      </div>

      {/* Galería de fotos profesional */}
      <div className="mb-2">
        <PhotoCarousel />
      </div>

      {/* Sección biográfica con tipografía FootballDecoded */}
      <BioSection />
    </div>
  )
}
