# ⚽ FootballDecoded

> Análisis táctico avanzado, métricas cuantitativas y scouting funcional para el fútbol profesional.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jaime-oriol/FootballDecoded)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fwww.footballdecoded.com)](https://www.footballdecoded.com)

## 🎯 Sobre FootballDecoded

FootballDecoded es un blog especializado que combina análisis táctico riguroso con visualización de datos para descifrar el fútbol moderno. A través de métricas avanzadas, modelos predictivos y estudios funcionales, transformamos información compleja en conocimiento práctico para entrenadores, analistas y responsables técnicos.

### ⚡ Características Principales

- **📊 Análisis Táctico**: Estudio de estilos, partidos clave y dinámicas de juego
- **🔍 Scouting Analítico**: Identificación de perfiles tácticos y segmentación funcional
- **📈 Métricas Avanzadas**: Modelos predictivos y visualización de datos aplicada al fútbol
- **💌 Newsletter Semanal**: Las 5 noticias más importantes del mundo del fútbol cada lunes
- **💬 Sistema de Comentarios**: Comunidad para discusión técnica

## 🚀 Stack Tecnológico

- **Framework**: [Next.js 15](https://nextjs.org/) con App Router
- **Estilado**: [Tailwind CSS 4](https://tailwindcss.com/) + Sistema tipográfico personalizado
- **Contenido**: [Contentlayer](https://contentlayer.dev/) + MDX para análisis técnicos
- **Autenticación**: [NextAuth.js](https://next-auth.js.org/) con Google OAuth
- **Email**: [Resend](https://resend.com/) para newsletter y notificaciones
- **Analytics**: [Umami](https://umami.is/) para métricas de uso
- **Deployment**: [Vercel](https://vercel.com/) con dominio personalizado

## 📁 Estructura del Proyecto

\`\`\`
footballdecoded/
├── app/ # Next.js App Router
│ ├── Main.tsx # Homepage principal
│ ├── about/ # Página sobre el autor
│ ├── api/ # API endpoints (newsletter, comentarios)
│ ├── blog/ # Sistema de blog con secciones
│ ├── contact/ # Página de contacto
│ └── newsletter/ # Sistema de newsletter
├── components/ # Componentes React reutilizables
├── content/ # Contenido del blog y configuración
│ ├── articles/ # Artículos organizados por sección
│ │ ├── player-decoded/
│ │ ├── match-analysis/
│ │ └── team-architecture/
│ └── siteMetadata.js # Configuración del sitio
├── layouts/ # Layouts especializados
└── public/ # Assets estáticos
\`\`\`

## 🛠️ Instalación y Desarrollo

### Prerrequisitos

- Node.js 18+
- Yarn o npm
- Cuenta en Google Console (para OAuth)
- Cuenta en Resend (para emails)

### Configuración Local

1. **Clonar el repositorio**
   \`\`\`bash
   git clone https://github.com/jaime-oriol/FootballDecoded.git
   cd FootballDecoded
   \`\`\`

2. **Instalar dependencias**
   \`\`\`bash
   yarn install

# o

npm install
\`\`\`

3. **Configurar variables de entorno**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

Configurar en \`.env.local\`:
\`\`\`env

# NextAuth

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-aqui

# Google OAuth

GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# Resend (Newsletter)

RESEND_API_KEY=tu-resend-api-key

# Umami Analytics (opcional)

UMAMI_WEBSITE_ID=tu-umami-id
\`\`\`

4. **Ejecutar en desarrollo**
   \`\`\`bash
   yarn dev

# o

npm run dev
\`\`\`

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## ✍️ Creación de Contenido

### Estructura de Artículos

Los artículos se organizan en tres secciones principales:

#### 📊 Tactical Analysis

\`\`\`
content/articles/player-decoded/ejemplo-analisis.mdx
\`\`\`

#### 🔍 Analytical Scouting

\`\`\`
content/articles/match-analysis/perfil-jugador.mdx
\`\`\`

#### 📈 Advanced Metrics

\`\`\`
content/articles/team-architecture/metrica-personalizada.mdx
\`\`\`

### Frontmatter de Artículos

## \`\`\`yaml

title: 'Título del Análisis'
date: '2024-01-15'
section: 'player-decoded' # player-decoded | match-analysis | team-architecture
image: '/static/images/articles/imagen-destacada.jpg'
tags: ['táctica', 'análisis', 'ejemplo']
summary: 'Descripción breve del análisis para SEO y cards'

---

\`\`\`

### Componentes MDX Disponibles

\`\`\`mdx

# Usar componentes personalizados en artículos

<TechnicalConcept type="metric">xG</TechnicalConcept>
<TechnicalConcept type="role">Mediocentro defensivo</TechnicalConcept>
<TechnicalConcept type="system">4-3-3</TechnicalConcept>

<Callout type="insight">
Insight importante sobre el análisis
</Callout>

<StatCard 
  title="Presión alta exitosa"
  value="78.4%"
  description="Porcentaje de recuperaciones en campo rival"
  trend="up"
/>

<TechnicalQuote source="Autor Ejemplo">
El fútbol es un juego de espacios y tiempo
</TechnicalQuote>
\`\`\`

## 📧 Sistema de Newsletter

### Gestión de Suscriptores

\`\`\`bash

# Ver estadísticas de newsletter

npm run newsletter list

# Exportar emails confirmados

npm run newsletter export

# Probar conexión a API

npm run newsletter test
\`\`\`

Los archivos se exportan a \`exports/\` (excluido del repositorio).

## 🔧 Scripts Disponibles

\`\`\`bash

# Desarrollo

npm run dev # Servidor de desarrollo
npm run build # Build de producción
npm run start # Servidor de producción

# Herramientas

npm run lint # Linting con ESLint
npm run newsletter # Gestión de newsletter
npm run analyze # Análisis del bundle
\`\`\`

## �� Deployment

### Vercel (Recomendado)

1. Conectar repositorio a Vercel
2. Configurar variables de entorno en dashboard
3. Deploy automático en cada push a \`main\`

### Variables de Entorno en Producción

Configurar en Vercel dashboard:

- \`NEXTAUTH_URL\`: URL de producción
- \`NEXTAUTH_SECRET\`: Secret para NextAuth
- \`GOOGLE_CLIENT_ID\` & \`GOOGLE_CLIENT_SECRET\`: OAuth Google
- \`RESEND_API_KEY\`: API key para emails

## 📝 Estilo y Convenciones

### Tipografía

- **Headings**: Inter (títulos y navegación)
- **Body**: IBM Plex Sans (contenido principal)
- **Monospace**: IBM Plex Mono (código y métricas)

### Convenciones de Nombres

- **Componentes**: PascalCase (\`ArticleCard.tsx\`)
- **Páginas**: kebab-case (\`about/page.tsx\`)
- **Archivos de contenido**: kebab-case (\`ejemplo-articulo.mdx\`)
- **Assets**: kebab-case (\`imagen-destacada.jpg\`)

### Colores Semánticos

\`\`\`css
/_ Secciones del blog _/
.player-decoded /_ Azul sky _/
.match-analysis /_ Verde emerald _/
.team-architecture /_ Índigo _/

/_ Estados _/
.text-concept /_ Enlaces y conceptos importantes _/
.badge-role /_ Badges para roles tácticos _/
\`\`\`

## 🤝 Contribución

1. Fork del proyecto
2. Crear rama feature (\`git checkout -b feature/nueva-metrica\`)
3. Commit cambios (\`git commit -m 'Add: nueva métrica xThreat'\`)
4. Push a la rama (\`git push origin feature/nueva-metrica\`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - ver archivo [LICENSE](LICENSE) para detalles.

## 📞 Contacto

- **Autor**: Jaime Oriol Goicoechea
- **Email**: joriolgo@gmail.com
- **Website**: [footballdecoded.com](https://www.footballdecoded.com)
- **Twitter**: [@JaimeOriol\_](https://x.com/JaimeOriol_)
- **LinkedIn**: [jaime-oriol-goicoechea](https://www.linkedin.com/in/jaime-oriol-goicoechea-801313276/)

---

**⚽ Descifra el fútbol moderno con datos, rigor y perspectiva táctica.**
