const BioSection = () => {
  return (
    <div className="relative bg-white dark:bg-slate-900">
      {/* Línea de separación sutil */}
      <div className="absolute top-0 left-1/2 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-500/30 to-transparent"></div>

      <div className="w-full space-y-6 px-4 py-16 sm:px-6">
        {/* Contenido biográfico - misma tipografía que Main.tsx */}
        <div className="font-body space-y-6 text-lg leading-relaxed text-slate-900 dark:text-slate-100">
          <p>
            Mi relación con el fútbol comenzó con el Barça de Messi cuando tenía ocho años. Recuerdo
            perfectamente aquella sensación: no era solo presenciar victorias, era observar una
            precisión quirúrgica donde cada pase formaba parte de una arquitectura mayor. Lo que
            empezó como admiración infantil evolucionó hacia una curiosidad analítica que define mi
            aproximación actual al juego.
          </p>

          <p>
            El fútbol ha sido una constante en mi vida, primero como jugador, después como
            observador meticuloso. Pero llegó un momento en que la observación pasiva resultó
            insuficiente. Necesitaba descifrar los mecanismos subyacentes, entender la lógica que
            transforma once individualidades en un sistema coherente, identificar los patrones que
            separan el caos aparente de la estrategia deliberada. Esa necesidad de comprensión
            profunda marcó mi trayectoria académica y profesional.
          </p>

          <p>
            Curso el cuarto año de un doble grado de cinco en Business Analytics e Ingeniería
            Informática en la Universidad Francisco de Vitoria, una combinación deliberadamente
            elegida. Además trabajo como Data Scientist en Minsait y curso el Máster en Big Data
            aplicado al Scouting en Fútbol en Sport Data Campus. En marzo de 2026 gané la categoría
            de Analysis del Opta Forum organizado por Stats Perform, presentando mi investigación
            sobre cómo los equipos rompen la presión alta del rival en Londres.
          </p>

          <p>
            Mi interés analítico se centra en lo imperceptible: las secuencias coordinadas que
            preceden a la acción decisiva, las micro-decisiones que alteran equilibrios tácticos,
            los patrones recurrentes que solo emergen mediante análisis sistemático. La pregunta que
            guía mi trabajo es siempre la misma: ¿puede esto medirse, explicarse y, eventualmente,
            predecirse?
          </p>

          <p>
            Soy barcelonista, pero en el análisis profesional la única lealtad debe ser con los
            datos y la objetividad. Cuando algo extraordinario ocurre en cualquier equipo, merece
            ser analizado con el mismo rigor metodológico. FootballDecoded nace precisamente de esa
            convicción: equilibrar la pasión por el juego con el rigor analítico necesario para
            comprenderlo verdaderamente.
          </p>

          <p>
            Me encuentro en una fase de exploración multidisciplinar, convencido de que la
            especialización prematura limita la perspectiva analítica. Este blog funciona como mi
            laboratorio personal donde convergen observación táctica y validación empírica, siempre
            con la ambición de expandir los límites de lo que podemos entender y medir en el fútbol
            moderno.
          </p>

          <div className="flex flex-col gap-3 pt-4 sm:flex-row">
            <a
              href="/static/CV_Jaime_Oriol.pdf"
              download
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-95 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              CV en Español
            </a>
            <a
              href="/static/CV_Jaime_Oriol_ING.pdf"
              download
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:shadow-md active:scale-95 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              CV in English
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BioSection
