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
    case 'analytics-lab':
      return 'Analytics Lab'
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
  switch (section) {
    case 'player-decoded':
      return 'border border-sky-600 text-sky-700 bg-transparent dark:border-sky-400 dark:text-sky-400'
    case 'match-analysis':
      return 'border border-emerald-600 text-emerald-700 bg-transparent dark:border-emerald-400 dark:text-emerald-400'
    case 'team-architecture':
      return 'border border-indigo-600 text-indigo-700 bg-transparent dark:border-indigo-400 dark:text-indigo-400'
    case 'analytics-lab':
      return 'border border-orange-600 text-orange-700 bg-transparent dark:border-orange-400 dark:text-orange-400'
    default:
      return 'border border-sky-600 text-sky-700 bg-transparent dark:border-sky-400 dark:text-sky-400'
  }
}

const getSectionAccentBg = (section: string) => {
  switch (section) {
    case 'player-decoded':
      return 'bg-sky-600 dark:bg-sky-400'
    case 'match-analysis':
      return 'bg-emerald-600 dark:bg-emerald-400'
    case 'team-architecture':
      return 'bg-indigo-600 dark:bg-indigo-400'
    case 'analytics-lab':
      return 'bg-orange-600 dark:bg-orange-400'
    default:
      return 'bg-sky-600 dark:bg-sky-400'
  }
}

const getSectionShadow = (section: string) => {
  switch (section) {
    case 'player-decoded':
      return 'hover:shadow-sky-500/10'
    case 'match-analysis':
      return 'hover:shadow-emerald-500/10'
    case 'team-architecture':
      return 'hover:shadow-indigo-500/10'
    case 'analytics-lab':
      return 'hover:shadow-orange-500/10'
    default:
      return 'hover:shadow-fd-500/10'
  }
}

export default function ArticleCard({ post }: ArticleCardProps) {
  const { slug, date, title, section, image, summary, readingTime, pinned } = post
  const minutes = readingTime ? Math.ceil(JSON.parse(JSON.stringify(readingTime)).minutes) : null
  const displayImage = image || '/static/images/default-article.jpg'

  return (
    <article
      className={`group ease-fd relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 ${getSectionShadow(section)}`}
    >
      <Link href={`/articles/${slug}`} className="flex flex-col sm:flex-row sm:items-stretch">
        {/* Imagen arriba en móvil, izquierda en desktop */}
        <div className="relative h-48 w-full flex-shrink-0 overflow-hidden bg-slate-200 sm:h-auto sm:w-64 dark:bg-slate-700">
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700" />
          <div className="absolute inset-0">
            <Image
              src={displayImage}
              alt={title}
              fill
              className="ease-fd object-cover transition-transform duration-500 group-hover:scale-105"
              priority={true}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={85}
              noWrapper={true}
            />
            {/* Overlay sutil para mejor contraste */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
            {/* Pin icon para artículos fijados */}
            {pinned && (
              <div className="absolute top-2 left-2 rounded-full bg-sky-600 p-1.5 shadow-md">
                <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Contenido principal - tipografía FootballDecoded */}
        <div className="min-w-0 flex-1 space-y-4 p-4 sm:p-6">
          {/* MÓVIL: Layout vertical con título completo arriba */}
          <div className="sm:hidden">
            {/* TÍTULO - ancho completo en móvil */}
            <h3 className="font-helvetica-bold group-hover:text-fd dark:group-hover:text-fd-300 mb-3 text-xl leading-tight font-bold tracking-tight text-slate-900 transition-colors dark:text-slate-100">
              {title}
            </h3>

            {/* Summary/descripción si existe */}
            {summary && (
              <p className="font-helvetica-light text-fd-body mb-4 line-clamp-2 leading-relaxed text-slate-600 dark:text-slate-400">
                {summary}
              </p>
            )}

            {/* ETIQUETA DE SECCIÓN alineada a la derecha encima de fecha */}
            {section && (
              <div className="mb-2 flex justify-end">
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
              <div className="text-fd-body text-fd group-hover:text-fd-700 dark:text-fd-300 dark:group-hover:text-fd-200 flex items-center font-medium transition-all duration-200">
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

              {/* Fecha y reading time */}
              <div className="flex flex-shrink-0 items-center gap-2 text-slate-600 dark:text-slate-300">
                {minutes && (
                  <span className="font-helvetica-light text-fd-body">{minutes} min</span>
                )}
                {minutes && <span className="text-slate-400 dark:text-slate-500">·</span>}
                <time dateTime={date} className="font-helvetica-light text-fd-body">
                  {formatDate(date, siteMetadata.locale)}
                </time>
              </div>
            </div>
          </div>

          {/* DESKTOP: Layout original horizontal */}
          <div className="hidden sm:block">
            {/* Header con título y etiqueta de sección en la misma línea */}
            <div className="flex items-start justify-between gap-4">
              {/* TÍTULO */}
              <h3 className="font-helvetica-bold group-hover:text-fd dark:group-hover:text-fd-300 flex-1 text-2xl leading-tight font-bold tracking-tight text-slate-900 transition-colors dark:text-slate-100">
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
              <div className="text-fd-body text-fd group-hover:text-fd-700 dark:text-fd-300 dark:group-hover:text-fd-200 flex items-center font-medium transition-all duration-200">
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

              {/* Fecha y reading time */}
              <div className="flex flex-shrink-0 items-center gap-2 text-slate-600 dark:text-slate-300">
                {minutes && (
                  <span className="font-helvetica-light text-fd-body">{minutes} min</span>
                )}
                {minutes && <span className="text-slate-400 dark:text-slate-500">·</span>}
                <time dateTime={date} className="font-helvetica-light text-fd-body">
                  {formatDate(date, siteMetadata.locale)}
                </time>
              </div>
            </div>
          </div>
        </div>

        {/* Accent bar de sección */}
        {section && (
          <div className="absolute bottom-0 left-0 h-[3px] w-full transition-all duration-300 sm:w-0 sm:group-hover:w-full">
            <div className={`h-full w-full ${getSectionAccentBg(section)}`} />
          </div>
        )}
      </Link>
    </article>
  )
}
