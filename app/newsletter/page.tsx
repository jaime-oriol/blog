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
      <div className="mx-auto max-w-4xl px-4 py-2 sm:px-6 xl:max-w-5xl xl:px-0">
        {/* Header minimalista y directo */}
        <div className="mb-8 text-left">
          <h1 className="font-headings text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl dark:text-slate-100">
            Newsletter
          </h1>
        </div>

        {/* CONTENIDO INFORMATIVO - Briefing profesional */}
        <div className="mb-12">
          <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <h3 className="font-headings mb-6 text-left text-2xl font-semibold text-slate-900 dark:text-slate-100">
              ¿Qué puede incluir cada edición?
            </h3>

            <div className="space-y-6">
              {[
                {
                  title: 'Notificaciones de nuevos artículos y novedades del blog',
                  description:
                    'Acceso directo a análisis recién publicados, actualizaciones técnicas y contenido relevante del blog.',
                },
                {
                  title: 'Reflexión analítica personal',
                  description:
                    'Mi perspectiva sobre tendencias emergentes, evoluciones tácticas y elementos del análisis que considere reveladores. Incluye reflexiones sobre jugadores específicos, partidos concretos y dinámicas que definan la dirección actual del juego.',
                },
                {
                  title: 'Movimientos estratégicos del mercado',
                  description:
                    'Fichajes y operaciones que generen impacto táctico real en los sistemas de juego. Análisis de cómo cada incorporación reconfigura la arquitectura colectiva y altera las dinámicas estratégicas del equipo.',
                },
                {
                  title: 'Contenido técnico seleccionado',
                  description:
                    'Investigaciones, recursos analíticos y material especializado curado por su valor aplicable. Recomendaciones técnicas que justifiquen la inversión de tiempo y aporten conocimiento genuino al análisis futbolístico.',
                },
              ].map((item, index) => (
                <div key={index} className="border-l-4 border-slate-200 pl-6 dark:border-slate-600">
                  <h4 className="font-headings mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </h4>
                  <p className="font-body text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FORMULARIO PRINCIPAL - Solo suscripción */}
        <div className="mb-12">
          <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div className="px-6 py-6 lg:px-8 lg:py-8">
              <div className="mx-auto max-w-sm space-y-4 text-center">
                {/* FORMULARIO - Diseño limpio y profesional */}
                <div>
                  <NewsletterForm />
                </div>

                {/* Garantías profesionales */}
                <div className="flex flex-col items-center justify-center space-y-3 pt-3 sm:flex-row sm:space-y-0 sm:space-x-8">
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

        {/* ÚLTIMO ARTÍCULO */}
        {latestPost && (
          <div>
            <h3 className="font-headings mb-6 text-2xl font-semibold text-slate-900 dark:text-slate-100">
              No te pierdas el último artículo
            </h3>
            <ArticleCard post={latestPost} />
          </div>
        )}
      </div>
    </>
  )
}
