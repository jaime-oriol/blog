import { genPageMetadata } from 'app/seo'
import { allBlogs } from 'contentlayer/generated'
import { sortPosts } from 'pliny/utils/contentlayer'
import NewsletterForm from '@/components/NewsletterForm'
import ArticleCard from '@/components/ArticleCard'

export const metadata = genPageMetadata({
  title: 'Newsletter - FootballDecoded',
  description:
    'Análisis futbolístico directo cuando realmente importa, con rigor técnico y sin ruido',
})

export default function Newsletter() {
  const sortedPosts = sortPosts(allBlogs)
  const latestPost = sortedPosts[0]

  return (
    <>
      <div className="divide-y divide-slate-200 dark:divide-slate-700">
        {/* Header minimalista y directo */}
        <div className="w-full space-y-3 px-4 pt-8 pb-6 sm:px-6">
          <h1 className="font-headings text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl dark:text-slate-100">
            Newsletter
          </h1>
          <p className="font-body text-xl leading-relaxed text-slate-600 dark:text-slate-400">
            Análisis futbolístico directo cuando realmente importa, con rigor técnico y sin ruido
          </p>
        </div>

        {/* FORMULARIO PRINCIPAL - Solo suscripción */}
        <div className="pt-10">
          <div className="w-full px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
              <div className="relative px-8 py-12 lg:px-12 lg:py-16">
                <div className="mx-auto max-w-md space-y-8 text-center">
                  {/* FORMULARIO - Diseño limpio y profesional */}
                  <div>
                    <NewsletterForm />
                  </div>

                  {/* Garantías profesionales */}
                  <div className="flex flex-col items-center justify-center space-y-3 pt-4 sm:flex-row sm:space-y-0 sm:space-x-8">
                    <div className="font-body flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <svg
                        className="mr-2 h-4 w-4 text-sky-600 dark:text-sky-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Sin spam
                    </div>
                    <div className="font-body flex items-center text-sm text-slate-500 dark:text-slate-400">
                      <svg
                        className="mr-2 h-4 w-4 text-sky-600 dark:text-sky-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Cancelación libre
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENIDO INFORMATIVO - Briefing profesional */}
        <div className="pt-12">
          <div className="w-full px-4 sm:px-6">
            <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <h3 className="font-headings mb-8 text-center text-2xl font-semibold text-slate-900 dark:text-slate-100">
                ¿Qué puede incluir cada edición?
              </h3>

              <div className="space-y-8">
                {[
                  {
                    title: 'Análisis de partidos clave',
                    description:
                      'Encuentros que revelen patrones tácticos significativos o marquen inflexiones en el rendimiento de equipos. Solo cuando el análisis aporte valor real más allá del resultado.',
                  },
                  {
                    title: 'Movimientos estratégicos del mercado',
                    description:
                      'Fichajes y operaciones que alteren dinámicas tácticas o confirmen tendencias en la construcción de plantillas. El enfoque en cómo cada incorporación modifica sistemas de juego.',
                  },
                  {
                    title: 'Detalles técnicos reveladores',
                    description:
                      'Situaciones específicas, jugadas o comportamientos colectivos que ilustren conceptos del fútbol moderno o expongan aspectos que pasan inadvertidos en el análisis convencional.',
                  },
                  {
                    title: 'Reflexión analítica personal',
                    description:
                      'Mi perspectiva sobre tendencias emergentes, evoluciones tácticas o elementos del análisis que considere relevantes para comprender la dirección del juego actual.',
                  },
                  {
                    title: 'Contenido técnico seleccionado',
                    description:
                      'Investigaciones, artículos especializados o recursos analíticos que aporten conocimiento aplicable. Solo recomendaciones que justifiquen el tiempo de lectura.',
                  },
                  {
                    title: 'Datos contextualizados',
                    description:
                      'Métricas que expliquen comportamientos tácticos específicos o revelen patrones no evidentes en el análisis superficial. Estadísticas que construyan narrativas, no cifras aisladas.',
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-slate-200 pl-6 dark:border-slate-600"
                  >
                    <h4 className="font-headings mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </h4>
                    <p className="font-body leading-relaxed text-slate-600 dark:text-slate-400">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ÚLTIMO ARTÍCULO */}
        {latestPost && (
          <div className="pt-12">
            <div className="w-full px-4 sm:px-6">
              <h3 className="font-headings mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                No te pierdas el último artículo
              </h3>
              <ArticleCard post={latestPost} />
            </div>
          </div>
        )}
      </div>
    </>
  )
}