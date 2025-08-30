import { genPageMetadata } from 'app/seo'
import Link from '@/components/Link'

export const metadata = genPageMetadata({ title: 'Contacto' })

export default function Contact() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-2 sm:px-6 xl:max-w-5xl xl:px-0">
      {/* Header profesional */}
      <div className="mb-8 text-left">
        <h1 className="font-headings mb-5 text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl dark:text-slate-100">
          Contacto
        </h1>
      </div>

      {/* ÁREAS DE ESPECIALIZACIÓN */}
      <div className="mb-12">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="font-headings mb-5 text-left text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Áreas de especialización
          </h2>

          <div className="space-y-6">
            {[
              {
                title: 'Análisis táctico',
                description:
                  'Estudio de estructuras de juego, sistemas posicionales y principios del fútbol moderno. Desarrollo de informes de rival, análisis de rendimiento colectivo y evaluación de modelos de juego.',
              },
              {
                title: 'Scouting funcional y perfilado',
                description:
                  'Identificación de jugadores por rol y función táctica específica. Desarrollo de matrices de evaluación, análisis comparativo de rendimientos y elaboración de informes para secretarías técnicas. Enfoque en compatibilidad sistémica y adaptabilidad táctica.',
              },
              {
                title: 'Desarrollo de métricas avanzadas',
                description:
                  'Creación de KPIs personalizados, modelos cuantitativos aplicados y sistemas de medición de rendimiento. Implementación de modelos predictivos, análisis de Expected Goals (xG) contextualizados y desarrollo de métricas específicas por posición y función.',
              },
              {
                title: 'Visualización de datos y reportes',
                description:
                  'Diseño de dashboards interactivos, reportes ejecutivos para clubes y herramientas de análisis visual. Desarrollo de interfaces intuitivas para la toma de decisiones técnicas y presentaciones estratégicas para cuerpos técnicos.',
              },
            ].map((item, index) => (
              <div key={index} className="border-l-4 border-slate-200 pl-6 dark:border-slate-600">
                <h3 className="font-headings mb-5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="font-body text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* INFORMACIÓN PARA EL CONTACTO */}
      <div>
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="font-headings mb-5 text-left text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Información para el contacto
          </h2>

          <div className="space-y-6">
            {[
              {
                title: 'Tipo de colaboración',
                description:
                  'Especifica si buscas consultoría puntual, desarrollo de proyecto a largo plazo, análisis específico de rival, evaluación de jugadores, implementación de sistemas analíticos o colaboración en investigación aplicada.',
              },
              {
                title: 'Contexto profesional',
                description:
                  'Detalla tu posición (entrenador, director deportivo, analista, scout, investigador), organización actual, nivel competitivo y experiencia previa en análisis cuantitativo.',
              },
              {
                title: 'Especificaciones del proyecto',
                description:
                  'Incluye objetivos concretos, timeline disponible, recursos técnicos actuales, herramientas preferidas, presupuesto orientativo y entregables esperados. Menciona si requieres formación adicional o transferencia de conocimiento.',
              },
            ].map((item, index) => (
              <div key={index} className="border-l-4 border-slate-200 pl-6 dark:border-slate-600">
                <h3 className="font-headings mb-5 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  {item.title}
                </h3>
                <p className="font-body text-slate-600 dark:text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>

          {/* EMAIL principal - destacado */}
          <div className="mt-8 border-t border-slate-200 pt-8 dark:border-slate-700">
            <a
              href="mailto:joriolgo@gmail.com"
              className="font-body block w-full rounded-lg bg-sky-600 px-6 py-4 text-center text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-sky-700 hover:shadow-xl focus:ring-4 focus:ring-sky-500/25"
            >
              <svg
                className="mr-3 inline h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z"
                />
              </svg>
              joriolgo@gmail.com
            </a>

            {/* Información adicional */}
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center space-x-4 font-mono text-xs text-slate-500 dark:text-slate-400">
                <span>• Respuesta típica: 24-48h</span>
                <span>• Zona horaria: CET (Madrid)</span>
                <span>• Idiomas: ES/EN</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
