const BioSection = () => {
  return (
    <div className="relative bg-white dark:bg-slate-900">
      {/* Línea de separación sutil */}
      <div className="absolute top-0 left-1/2 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-500/30 to-transparent"></div>

      <div className="w-full space-y-6 px-4 py-16 sm:px-6">
        {/* Contenido biográfico - misma tipografía que Main.tsx */}
        <div className="font-body space-y-6 text-lg leading-relaxed text-slate-700 dark:text-slate-300">
          <p>
            Mi primera memoria futbolística real fue el Barça de Messi. Tenía unos 8 años y lo
            recuerdo perfectamente: no era solo la victoria, era esa precisión absoluta que
            convertía cada pase en parte de algo más grande. Desde entonces, lo que comenzó como
            admiración pura se transformó en una curiosidad analítica que no he podido —ni
            querido— abandonar.
          </p>

          <p>
            El fútbol siempre ha estado presente en mi vida, primero como jugador, después como
            observador obsesivo. Pero llegó un momento en que mirar ya no era suficiente.
            Necesitaba entender el porqué detrás de cada movimiento, la lógica oculta que convierte
            once individualidades en un sistema coherente. Esa necesidad de descifrar los patrones
            me llevó a donde estoy hoy.
          </p>

          <p>
            Curso 4º de un doble grado en Business Analytics e Ingeniería Informática en la UFV,
            una combinación que no fue casual. Creo firmemente que el futuro del análisis
            futbolístico pasa por dominar tanto el lenguaje de los datos como las herramientas que
            los hacen hablar. Este año, además, inicio el Máster en Big Data aplicado al Scouting
            en fútbol del Sevilla FC en Sport Data Campus, porque hay algo fascinante en la idea de
            traducir intuición futbolística en modelos predictivos rigurosos.
          </p>

          <p>
            Lo que realmente me apasiona del análisis no son los highlights ni las jugadas obvias.
            Es lo sutil: esos movimientos coordinados que preceden a la acción decisiva, las
            micro-decisiones que alteran el equilibrio del juego, los patrones que se repiten pero
            que solo se revelan cuando miras más allá del resultado. Mi gran pregunta siempre es la
            misma: ¿esto se puede medir y explicar?
          </p>

          <p>
            Soy del Barça, sí, pero he aprendido que la lealtad en el análisis debe ser solo con la
            verdad y los datos. Si algo brillante sucede en cualquier equipo, merece ser
            comprendido y explicado con la misma precisión. FootballDecoded nació de esa necesidad
            de equilibrio entre pasión y rigor.
          </p>

          <p>
            Estoy en una etapa de exploración constante, aprendiendo sobre todas las áreas del
            análisis moderno porque creo que la especialización prematura limita la perspectiva.
            Por ahora, mi laboratorio es este blog donde intento unir lo que veo con lo que puedo
            probar, siempre con la curiosidad de seguir preguntando.
          </p>
        </div>
      </div>
    </div>
  )
}

export default BioSection
