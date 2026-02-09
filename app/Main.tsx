// app/Main.tsx
import Link from '@/components/Link'
import ArticleCard from '@/components/ArticleCard'
import FadeIn from '@/components/FadeIn'
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
    <div className="mx-auto max-w-full px-3 py-4 sm:max-w-5xl sm:px-4 md:px-6 xl:px-0">
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
    <section className="mb-12">
      {/* Cita destacada como título principal */}
      <blockquote className="mb-8 border-l-4 border-sky-600 bg-slate-50 py-4 pl-6 dark:border-sky-400 dark:bg-slate-800/50">
        <p className="font-helvetica-bold text-xl font-bold text-slate-900 italic sm:text-2xl dark:text-slate-100">
          "El fútbol es como el ajedrez, pero sin dados."
        </p>
        <cite className="font-helvetica-regular mt-2 block text-lg font-medium text-slate-600 not-italic dark:text-slate-400">
          — Lukas Podolski
        </cite>
      </blockquote>

      {/* Descripción del proyecto */}
      <div className="font-helvetica-light text-fd-body space-y-6 leading-relaxed text-slate-900 dark:text-slate-100">
        <p>
          La paradoja de Podolski captura perfectamente la dualidad del fútbol moderno: un juego de
          estrategia pura donde el azar no debería existir, pero donde lo impredecible define los
          momentos decisivos. FootballDecoded nace precisamente en esa intersección entre lo medible
          y lo intangible, donde cada partido genera miles de datos pero los números aislados nunca
          cuentan la historia completa.
        </p>

        <p>
          Este no es otro repositorio de estadísticas ni un manual de formaciones tácticas. Es un
          laboratorio de análisis aplicado donde los datos cobran sentido a través del contexto,
          donde las visualizaciones revelan patrones invisibles, y donde los modelos predictivos van
          más allá del resultado final para entender el proceso que lo genera. Mi enfoque
          metodológico combina ciencia de datos avanzada con modelos predictivos validados
          empíricamente, visualizaciones tácticas que traducen complejidad en claridad, y un
          análisis profundo de las micro-decisiones y dinámicas colectivas que verdaderamente
          determinan el rendimiento en el campo.
        </p>

        <p>
          Aquí, el análisis cuantitativo no simplifica el fútbol; lo decodifica. Cada artículo
          examina los movimientos que preceden a la jugada decisiva, las secuencias tácticas que
          construyen goles, las decisiones posicionales que definen partidos. El objetivo es
          transformar información compleja en conocimiento aplicable, proporcionando insights
          accionables para entrenadores, analistas y profesionales del deporte que buscan entender
          el juego más allá de la superficie.
        </p>

        <p>
          FootballDecoded es mi espacio de exploración futbolística rigurosa, donde cada análisis
          busca medir lo medible, interpretar lo complejo y anticipar lo posible. Porque el fútbol
          del siglo XXI se juega tanto en el campo como en los datos, y entender ambas dimensiones
          es fundamental para decodificar verdaderamente el juego moderno.
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
    <section className="mb-12">
      <h2 className="font-helvetica-bold text-fd-title mb-8 font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Últimos Artículos
      </h2>

      {/* Estado vacío */}
      {!hasArticles && <EmptyArticlesState />}

      {/* Lista de artículos */}
      {hasArticles && (
        <>
          <div className="space-y-6">
            {recentPosts.map((post, i) => (
              <FadeIn key={post.slug} delay={i * 80}>
                <ArticleCard post={post} />
              </FadeIn>
            ))}
          </div>

          {/* CTA hacia todos los artículos */}
          <div className="mt-8 text-center">
            <Link
              href="/articles"
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 shadow-sm transition-all duration-200 hover:bg-slate-50 hover:shadow-md active:scale-95 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <span className="font-helvetica-regular">Ver todos los artículos</span>
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
    <div className="py-16 text-center">
      <DocumentIcon />
      <h3 className="font-helvetica-bold text-fd-subtitle mb-8 font-medium text-slate-900 dark:text-slate-100">
        Próximamente
      </h3>
      <p className="font-helvetica-light text-fd-body text-slate-500 dark:text-slate-400">
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
    <section>
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="space-y-4 text-center">
          <p className="font-helvetica-light text-fd-subtitle text-slate-600 dark:text-slate-400">
            <strong className="font-helvetica-bold">Newsletter:</strong> Análisis futbolístico
            directo cuando realmente importa, con rigor técnico y sin ruido
          </p>

          <Link
            href="/newsletter"
            className="inline-flex items-center rounded-lg bg-sky-600 px-6 py-3 font-medium text-white shadow-sm transition-all hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 active:scale-95"
          >
            <span className="font-helvetica-regular">Suscribirse gratis</span>
            <ArrowRightIcon />
          </Link>
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
