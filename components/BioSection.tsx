const BioSection = () => {
  return (
    <div className="relative bg-white dark:bg-slate-900">
      {/* Línea de separación sutil */}
      <div className="absolute top-0 left-1/2 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-500/30 to-transparent"></div>

      <div className="w-full space-y-6 px-4 py-16 sm:px-6">
        {/* Contenido biográfico - misma tipografía que Main.tsx */}
        <div className="font-body space-y-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
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
            Actualmente curso el cuarto año de un doble grado en Business Analytics e Ingeniería
            Informática en la Universidad Francisco de Vitoria, una combinación deliberadamente
            elegida. El futuro del análisis futbolístico requiere dominar tanto el lenguaje
            estadístico como las herramientas computacionales que lo hacen aplicable. Este año
            inicio además el Máster en Big Data aplicado al Scouting del Sevilla FC en Sport Data
            Campus, buscando traducir la intuición futbolística en modelos predictivos rigurosos y
            aplicables al rendimiento profesional.
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
        </div>
      </div>
    </div>
  )
}

export default BioSection
