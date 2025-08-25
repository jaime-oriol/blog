// app/Main.tsx
import Link from '@/components/Link'
import ArticleCard from '@/components/ArticleCard'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'

// Constantes de configuración
const MAX_DISPLAY = 3

// Tipos específicos para este componente
interface MainProps {
  posts: CoreContent<Blog>[]
}

/**
 * Componente principal de la homepage de FootballDecoded
 *
 * Estructura:
 * - Sección introductoria con descripción del proyecto
 * - Lista de artículos recientes (máximo 3)
 * - CTA hacia todos los artículos
 * - CTA de suscripción a newsletter
 */
export default function Main({ posts }: MainProps) {
  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-700">
      {/* === SECCIÓN INTRODUCTORIA === */}
      <IntroSection />

      {/* === ARTÍCULOS RECIENTES === */}
      <RecentArticlesSection posts={posts} />

      {/* === NEWSLETTER CTA === */}
      <NewsletterSection />
    </div>
  )
}

/**
 * Sección introductoria con descripción del proyecto
 */
function IntroSection() {
  return (
    <section className="mx-auto w-full space-y-6 px-4 pt-8 pb-10 sm:px-6">
      {/* Título principal */}
      <h1 className="font-headings text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl dark:text-slate-100">
        FootballDecoded
      </h1>

      {/* Cita destacada */}
      <blockquote className="border-l-4 border-slate-400 pl-4 italic">
        <p className="font-body text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          "El fútbol es como el ajedrez, pero sin dados." — Lukas Podolski
        </p>
      </blockquote>

      {/* Descripción del proyecto */}
      <div className="font-body space-y-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
        <p>
          FootballDecoded nace precisamente de esta aparente contradicción: el fútbol tiene
          estructuras, patrones y decisiones estratégicas claras, pero siempre conserva algo que se
          resiste a los números puros. Justo ahí, en esa tensión constante entre lo calculable y lo
          impredecible, surge la verdadera esencia del análisis moderno.
        </p>

        <p>
          Este blog no es una colección de estadísticas en bruto ni un manual de esquemas tácticos.
          Es una exploración rigurosa del juego a través de datos contextualizados, visualizaciones
          que revelan patrones ocultos y modelos que van más allá del resultado final. Aquí el
          análisis cuantitativo no simplifica el fútbol, sino que desvela lo que realmente define el
          rendimiento: las micro-decisiones, los movimientos que preceden a la jugada clave, las
          dinámicas colectivas que determinan victorias y derrotas.
        </p>

        <p>
          Mi trabajo combina herramientas avanzadas de ciencia de datos con modelos predictivos
          validados y visualizaciones tácticas intuitivas, siempre orientado hacia un objetivo
          claro: transformar información compleja en conocimiento aplicable para entrenadores,
          analistas y profesionales del deporte.
        </p>

        <p>
          FootballDecoded es mi laboratorio de exploración futbolística, donde cada análisis busca
          medir, comprender y anticipar el juego con la curiosidad del investigador y la precisión
          del especialista.
        </p>
      </div>
    </section>
  )
}

/**
 * Sección de artículos recientes
 */
function RecentArticlesSection({ posts }: { posts: CoreContent<Blog>[] }) {
  const recentPosts = posts.slice(0, MAX_DISPLAY)
  const hasArticles = recentPosts.length > 0

  return (
    <section className="pt-10">
      <div className="w-full px-4 sm:px-6">
        <h2 className="font-headings mb-8 text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Últimos Artículos
        </h2>
      </div>

      {/* Estado vacío */}
      {!hasArticles && <EmptyArticlesState />}

      {/* Lista de artículos */}
      {hasArticles && (
        <>
          <div className="w-full space-y-6 px-4 sm:px-6">
            {recentPosts.map((post) => (
              <ArticleCard key={post.slug} post={post} />
            ))}
          </div>

          {/* CTA hacia todos los artículos */}
          <div className="pt-10 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow-md dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <span className="font-body">Ver todos los artículos</span>
              <ArrowRightIcon />
            </Link>
          </div>
        </>
      )}
    </section>
  )
}

/**
 * Estado cuando no hay artículos publicados
 */
function EmptyArticlesState() {
  return (
    <div className="w-full px-4 py-16 text-center sm:px-6">
      <DocumentIcon />
      <h3 className="font-headings mb-2 text-xl font-medium text-slate-900 dark:text-slate-100">
        Próximamente
      </h3>
      <p className="font-body text-slate-500 dark:text-slate-400">
        Los primeros análisis tácticos, scouting funcional y métricas avanzadas estarán disponibles
        muy pronto.
      </p>
    </div>
  )
}

/**
 * Sección de newsletter con CTA
 */
function NewsletterSection() {
  return (
    <section className="pt-10">
      <div className="w-full px-4 sm:px-6">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="space-y-4 text-center">
            <p className="font-body text-lg text-slate-600 dark:text-slate-400">
              Newsletter: Análisis futbolístico directo cuando realmente importa, con rigor técnico y sin
              ruido
            </p>

            <Link
              href="/newsletter"
              className="inline-flex items-center rounded-lg bg-sky-600 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              <span className="font-body">Suscribirse gratis</span>
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * Componentes de iconos reutilizables
 */
function ArrowRightIcon() {
  return (
    <svg className="ml-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function DocumentIcon() {
  return (
    <svg
      className="mx-auto mb-4 h-12 w-12 text-slate-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  )
}
