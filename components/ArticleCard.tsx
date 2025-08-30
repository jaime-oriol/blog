import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Image from '@/components/Image'
import siteMetadata from '@/content/siteMetadata'

interface ArticleCardProps {
  post: CoreContent<Blog>
}

const getSectionLabel = (section: string) => {
  switch (section) {
    case 'player-decoded':
      return 'Player Decoded'
    case 'match-analysis':
      return 'Match Analysis'
    case 'team-architecture':
      return 'Team Architecture'
    case 'tactical-analysis': // Backward compatibility
      return 'Player Decoded'
    case 'analytical-scouting': // Backward compatibility
      return 'Match Analysis'
    case 'scouting': // Backward compatibility
      return 'Match Analysis'
    case 'advanced-metrics': // Backward compatibility
      return 'Team Architecture'
    case 'tactical-metrics-lab': // Backward compatibility
      return 'Team Architecture'
    case 'tactical-structures': // Backward compatibility
      return 'Player Decoded'
    default:
      return 'Análisis'
  }
}

const getSectionColor = (section: string) => {
  return 'border border-sky-600 text-sky-700 bg-transparent dark:border-sky-400 dark:text-sky-400'
}

export default function ArticleCard({ post }: ArticleCardProps) {
  const { slug, date, title, section, image, summary } = post
  const displayImage = image || '/static/images/default-article.jpg'

  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-slate-700 dark:bg-slate-800">
      <Link href={`/articles/${slug}`} className="flex flex-col md:flex-row md:items-stretch">
        {/* Imagen arriba en móvil, izquierda en desktop */}
        <div className="relative h-48 w-full flex-shrink-0 overflow-hidden md:h-auto md:w-64">
          <div className="absolute inset-0">
            <Image
              src={displayImage}
              alt={title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
            {/* Overlay sutil para mejor contraste */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
          </div>
        </div>

        {/* Contenido principal - tipografía FootballDecoded */}
        <div className="min-w-0 flex-1 space-y-4 p-4 md:p-6">
          {/* MÓVIL: Layout vertical con título completo arriba */}
          <div className="md:hidden">
            {/* TÍTULO - ancho completo en móvil */}
            <h3 className="font-helvetica-bold text-fd-subtitle mb-3 leading-tight font-bold tracking-tight text-slate-900 transition-colors group-hover:text-sky-700 dark:text-slate-100 dark:group-hover:text-sky-400">
              {title}
            </h3>

            {/* Summary/descripción si existe */}
            {summary && (
              <p className="font-helvetica-light text-fd-body mb-4 line-clamp-2 leading-relaxed text-slate-600 dark:text-slate-400">
                {summary}
              </p>
            )}

            {/* ETIQUETA DE SECCIÓN encima de fecha */}
            {section && (
              <div className="mb-2">
                <span
                  className={`inline-flex items-center rounded-md px-2.5 py-1 font-mono text-xs font-semibold shadow-sm ${getSectionColor(section)}`}
                >
                  {getSectionLabel(section)}
                </span>
              </div>
            )}

            {/* Footer con CTA y fecha */}
            <div className="flex items-center justify-between">
              {/* CTA */}
              <div className="text-fd-body flex items-center font-medium text-sky-700 transition-all duration-200 group-hover:text-sky-600 dark:text-sky-400 dark:group-hover:text-sky-300">
                <span className="font-helvetica-regular">Leer análisis</span>
                <svg
                  className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Fecha */}
              <time
                dateTime={date}
                className="font-helvetica-light text-fd-body flex-shrink-0 text-slate-500 dark:text-slate-400"
              >
                {formatDate(date, siteMetadata.locale)}
              </time>
            </div>
          </div>

          {/* DESKTOP: Layout original horizontal */}
          <div className="hidden md:block">
            {/* Header con título y etiqueta de sección en la misma línea */}
            <div className="flex items-start justify-between gap-4">
              {/* TÍTULO */}
              <h3 className="font-helvetica-bold text-fd-subtitle flex-1 leading-tight font-bold tracking-tight text-slate-900 transition-colors group-hover:text-sky-700 dark:text-slate-100 dark:group-hover:text-sky-400">
                {title}
              </h3>

              {/* ETIQUETA DE SECCIÓN */}
              {section && (
                <span
                  className={`inline-flex flex-shrink-0 items-center rounded-md px-2.5 py-1 font-mono text-xs font-semibold shadow-sm ${getSectionColor(section)}`}
                >
                  {getSectionLabel(section)}
                </span>
              )}
            </div>

            {/* Summary/descripción si existe */}
            {summary && (
              <p className="font-helvetica-light text-fd-body mt-4 line-clamp-2 leading-relaxed text-slate-600 dark:text-slate-400">
                {summary}
              </p>
            )}

            {/* Footer con CTA y fecha */}
            <div className="flex items-center justify-between pt-4">
              {/* CTA - lenguaje directo para profesionales */}
              <div className="text-fd-body flex items-center font-medium text-sky-700 transition-all duration-200 group-hover:text-sky-600 dark:text-sky-400 dark:group-hover:text-sky-300">
                <span className="font-helvetica-regular">Leer análisis</span>
                <svg
                  className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>

              {/* Fecha con formato Helvética Light para consistencia */}
              <time
                dateTime={date}
                className="font-helvetica-light text-fd-body flex-shrink-0 text-slate-500 dark:text-slate-400"
              >
                {formatDate(date, siteMetadata.locale)}
              </time>
            </div>
          </div>
        </div>
      </Link>
    </article>
  )
}
