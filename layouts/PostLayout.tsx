'use client'

// layouts/PostLayout.tsx
import { ReactNode, useState } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import CommentForm from '@/components/CommentForm'
import CommentsList from '@/components/CommentsList'
import Link from '@/components/Link'
import Image from '@/components/Image'
import siteMetadata from '@/content/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'

const postDateTemplate: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string; slug: string } | null
  prev?: { path: string; title: string; slug: string } | null
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, image, section } = content
  const displayImage = image || '/static/images/default-article-banner.jpg'

  // Estado para refrescar comentarios cuando se añade uno nuevo
  const [refreshComments, setRefreshComments] = useState(0)

  const handleCommentAdded = () => {
    setRefreshComments((prev) => prev + 1)
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

  const getSectionHref = (section: string) => {
    switch (section) {
      case 'player-decoded':
        return '/articles/player-decoded'
      case 'match-analysis':
        return '/articles/match-analysis'
      case 'team-architecture':
        return '/articles/team-architecture'
      case 'tactical-analysis': // Backward compatibility
      case 'tactical-structures': // Backward compatibility
        return '/articles/player-decoded'
      case 'analytical-scouting': // Backward compatibility
      case 'scouting': // Backward compatibility
        return '/articles/match-analysis'
      case 'advanced-metrics': // Backward compatibility
      case 'tactical-metrics-lab': // Backward compatibility
        return '/articles/team-architecture'
      default:
        return '/articles'
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-3 py-2 sm:px-4 md:px-6 xl:max-w-5xl xl:px-0">
      <ScrollTopAndComment />

      {/* Breadcrumb profesional */}
      <div className="mb-8">
        <nav className="font-helvetica-light text-fd-body flex items-center space-x-2 text-slate-500 dark:text-slate-400">
          <Link
            href="/"
            className="transition-colors hover:text-slate-700 dark:hover:text-slate-300"
          >
            Inicio
          </Link>
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <Link
            href="/articles"
            className="transition-colors hover:text-slate-700 dark:hover:text-slate-300"
          >
            Artículos
          </Link>
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <Link
            href={getSectionHref(section)}
            className="transition-colors hover:text-slate-700 dark:hover:text-slate-300"
          >
            {getSectionLabel(section)}
          </Link>
        </nav>
      </div>

      <article>
        <div>
          {/* Header del artículo - diseño profesional */}
          <header className="relative mb-10">
            {/* Header con imagen de fondo difuminada */}
            {displayImage && (
              <div className="relative mb-10 h-64 overflow-hidden rounded-xl md:h-80">
                {/* Imagen de fondo recortada y difuminada */}
                <div
                  className="absolute inset-0 scale-110 bg-cover bg-center blur-[1px]"
                  style={{
                    backgroundImage: `url(${displayImage})`,
                    backgroundPosition: 'center center',
                  }}
                />
                {/* Overlay para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40" />

                {/* Contenido superpuesto */}
                <div className="relative flex h-full flex-col justify-between p-6 text-white md:p-8">
                  {/* Título alineado a la izquierda */}
                  <div className="flex flex-1 items-center justify-start">
                    <h1 className="font-helvetica-bold w-full rounded-xl bg-gradient-to-r from-black/40 via-black/30 to-black/40 px-4 py-3 text-left text-xl leading-snug font-bold tracking-tight text-white shadow-2xl backdrop-blur-sm sm:px-6 sm:py-4 sm:text-2xl lg:text-3xl">
                      {title}
                    </h1>
                  </div>

                  {/* Sección y fecha abajo a la derecha */}
                  <div className="flex justify-end">
                    <div className="flex flex-col items-end space-y-2">
                      {/* Badge de sección con color azul corporativo */}
                      {section && (
                        <span className="inline-flex items-center rounded-full border border-sky-400/30 bg-sky-600/90 px-4 py-2 font-mono text-sm font-medium text-white shadow-sm backdrop-blur-sm">
                          {getSectionLabel(section)}
                        </span>
                      )}

                      {/* Fecha */}
                      <time dateTime={date} className="font-helvetica-light text-white/90">
                        {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                      </time>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </header>

          {/* Contenido del artículo con prose optimizado - ANCHO COMPLETO y espaciado compacto */}
          <div className="mb-12">
            <div className="prose prose-slate prose-lg dark:prose-invert prose-headings:mb-3 prose-headings:mt-5 prose-headings:text-slate-900 dark:prose-headings:text-slate-100 prose-p:mb-3 prose-p:leading-relaxed prose-ul:mb-3 prose-ol:mb-3 prose-blockquote:mb-3 prose-pre:mb-3 prose-h1:mb-3 prose-h1:mt-6 prose-h1:text-slate-900 dark:prose-h1:text-slate-100 prose-h2:mb-2 prose-h2:mt-5 prose-h2:text-slate-900 dark:prose-h2:text-slate-100 prose-h3:mb-2 prose-h3:mt-3 prose-h3:text-slate-900 dark:prose-h3:text-slate-100 prose-h4:mb-1 prose-h4:mt-2 prose-h4:text-slate-900 dark:prose-h4:text-slate-100 max-w-none">
              {children}
            </div>
          </div>

          {/* Información del autor */}
          {authorDetails.length > 0 && (
            <div className="mb-12 border-t border-slate-200 pt-8 dark:border-slate-700">
              <div className="flex items-center space-x-4">
                {authorDetails.map((author, index) => (
                  <div key={`${author.name}-${index}`} className="flex items-center">
                    {author.avatar && (
                      <Image
                        src={author.avatar}
                        width={56}
                        height={56}
                        alt="avatar"
                        className="mr-4 h-14 w-14 rounded-full"
                      />
                    )}
                    <div>
                      <div className="font-helvetica-bold text-fd-subtitle font-bold text-slate-900 dark:text-slate-100">
                        {author.name}
                      </div>
                      <div className="font-helvetica-light text-fd-body text-slate-600 dark:text-slate-400">
                        {author.occupation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sistema de comentarios personalizado */}
          <div className="mb-12 border-t border-slate-200 pt-8 dark:border-slate-700">
            {/* Lista de comentarios existentes */}
            <CommentsList
              postSlug={slug.split('/').pop() || slug}
              refreshTrigger={refreshComments}
            />

            {/* Formulario para nuevos comentarios */}
            <CommentForm
              postSlug={slug.split('/').pop() || slug}
              onCommentAdded={handleCommentAdded}
            />
          </div>

          {/* Navegación entre artículos */}
          {(prev || next) && (
            <div className="mb-12 border-t border-slate-200 pt-8 dark:border-slate-700">
              <div className="grid gap-6 md:grid-cols-2">
                {prev && (
                  <div className="group">
                    <p className="font-helvetica-light mb-2 text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                      Artículo anterior
                    </p>
                    <Link
                      href={`/articles/${prev.slug}`}
                      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                      <h3 className="font-helvetica-bold text-fd-subtitle font-medium text-slate-900 transition-colors group-hover:text-sky-700 dark:text-slate-100 dark:group-hover:text-sky-400">
                        {prev.title}
                      </h3>
                    </Link>
                  </div>
                )}

                {next && (
                  <div className="group">
                    <p className="font-helvetica-light mb-2 text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                      Siguiente artículo
                    </p>
                    <Link
                      href={`/articles/${next.slug}`}
                      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                      <h3 className="font-helvetica-bold text-fd-subtitle font-medium text-slate-900 transition-colors group-hover:text-sky-700 dark:text-slate-100 dark:group-hover:text-sky-400">
                        {next.title}
                      </h3>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CTA final para volver al blog */}
          <div className="text-center">
            <Link
              href="/articles"
              className="font-helvetica-regular inline-flex items-center rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Volver a todos los artículos
            </Link>
          </div>
        </div>
      </article>
    </div>
  )
}
