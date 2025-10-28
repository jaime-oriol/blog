import { genPageMetadata } from 'app/seo'
import ImageGallery from '@/components/ImageGallery'

export const metadata = genPageMetadata({
  title: 'Visualizaciones',
  description:
    'Galería de visualizaciones tácticas: pass networks, shot maps, radares estadísticos y comparativas de jugadores',
})

export default function Page() {
  return (
    <div className="mx-auto max-w-full px-4 py-2 sm:max-w-7xl sm:px-6 xl:px-0">
      {/* Header de la sección */}
      <div className="mb-8 text-left">
        <h1 className="font-headings mb-4 text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl dark:text-slate-100">
          Visualizaciones
        </h1>
        <p className="font-helvetica-regular text-fd-body text-slate-600 dark:text-slate-400">
          Visualizaciones personalizadas creadas con Python y librerías de análisis, a partir de
          datos obtenidos mediante web scraping y gestionados en una base de datos SQL.
        </p>
      </div>

      {/* Galería de visualizaciones */}
      <ImageGallery />
    </div>
  )
}
