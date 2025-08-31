import { genPageMetadata } from 'app/seo'
import Link from '@/components/Link'

export const metadata = genPageMetadata({ title: 'Contacto' })

export default function Contact() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-2 sm:px-6 xl:max-w-5xl xl:px-0">
      {/* Header profesional */}
      <div className="mb-8 text-left">
        <h1 className="font-headings mb-8 text-4xl font-bold tracking-tight text-slate-900 lg:text-5xl dark:text-slate-100">
          Contacto
        </h1>
      </div>

      {/* ÁREAS DE ESPECIALIZACIÓN */}
      <div className="mb-12">
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <h2 className="font-headings mb-8 text-left text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Áreas de especialización
          </h2>

          <div className="space-y-6">
            {[
              {
                title: 'Análisis táctico',
                description:
                  'Desarrollo estudios profundos de estructuras de juego, sistemas posicionales y principios del fútbol moderno. Mi trabajo incluye elaboración de informes detallados de rival, análisis de rendimiento colectivo mediante métricas contextualizadas y evaluación comparativa de modelos de juego. Cada análisis combina observación cualitativa con validación cuantitativa para proporcionar insights accionables sobre fortalezas, debilidades y tendencias tácticas identificables.',
              },
              {
                title: 'Scouting funcional y perfilado',
                description:
                  'Identificación y evaluación de jugadores según rol específico y compatibilidad táctica con sistemas predefinidos. Desarrollo matrices de evaluación personalizadas que van más allá de las estadísticas básicas, incorporando análisis comparativo contextualizado y elaboración de informes técnicos para secretarías técnicas y direcciones deportivas. Mi enfoque prioriza la compatibilidad sistémica del jugador con el modelo de juego del equipo receptor y su capacidad de adaptación táctica a diferentes contextos competitivos.',
              },
              {
                title: 'Desarrollo de métricas avanzadas',
                description:
                  'Creación de KPIs personalizados adaptados a las necesidades específicas de cada club o proyecto. Implementación de modelos cuantitativos aplicados, sistemas de medición de rendimiento contextualizado y desarrollo de modelos predictivos basados en datos históricos y tendencias actuales. Especialización en análisis de Expected Goals (xG) ajustados por contexto táctico y desarrollo de métricas específicas según posición, función y sistema de juego implementado.',
              },
              {
                title: 'Visualización de datos y reportes',
                description:
                  'Diseño de dashboards interactivos que transforman datos complejos en información comprensible y accionable. Desarrollo de reportes ejecutivos adaptados al lenguaje y necesidades específicas de cada nivel organizacional, desde cuerpos técnicos hasta juntas directivas. Creación de herramientas de análisis visual que optimizan el proceso de toma de decisiones y presentaciones estratégicas que comunican insights complejos de forma clara y efectiva.',
              },
            ].map((item, index) => (
              <div key={index} className="border-l-4 border-slate-200 pl-6 dark:border-slate-600">
                <h3 className="font-headings mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
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
          <h2 className="font-headings mb-8 text-left text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Información para colaboración
          </h2>

          <div className="space-y-6">
            {[
              {
                title: 'Tipo de proyecto',
                description:
                  'Define el alcance de la colaboración requerida: consultoría puntual para problemas específicos, desarrollo de proyectos a largo plazo con implementación gradual, análisis detallado de rivales para partidos concretos, evaluación integral de jugadores para fichajes, implementación de sistemas analíticos completos en tu organización, o colaboración en proyectos de investigación aplicada al rendimiento deportivo.',
              },
              {
                title: 'Contexto profesional',
                description:
                  'Comparte tu posición actual en la estructura deportiva (entrenador, director deportivo, analista, scout, coordinador de metodología, investigador), la organización que representas, el nivel competitivo en el que operas, y tu experiencia previa con análisis cuantitativo y herramientas de datos. Esta información permite personalizar la propuesta según las capacidades técnicas existentes y los objetivos específicos del proyecto.',
              },
              {
                title: 'Especificaciones del proyecto',
                description:
                  'Incluye objetivos concretos y medibles, timeline disponible para la ejecución, recursos técnicos actuales de tu organización, herramientas de análisis ya implementadas o preferidas, rango presupuestario contemplado y entregables esperados con su formato específico. Indica si el proyecto requiere formación del personal existente, transferencia de conocimiento para garantizar sostenibilidad, o desarrollo de capacidades internas de análisis.',
              },
            ].map((item, index) => (
              <div key={index} className="border-l-4 border-slate-200 pl-6 dark:border-slate-600">
                <h3 className="font-headings mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
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
