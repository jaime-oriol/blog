# CLAUDE.md - FootballDecoded Blog Development Guide

## Core Philosophy

**Ve paso a paso, uno a uno. Despacio es el camino más rápido. Escribe siempre el código lo más compacto y conciso posible, y que cumpla exactamente lo pedido al 100%. Sin emojis ni florituras. Usa nombres claros y estándar. Incluye solo comentarios útiles y necesarios.**

Antes de realizar cualquier tarea, revisa cuidadosamente el archivo CLAUDE.md.
Ahí encontrarás las directrices de trabajo y la estructura del proyecto que debes seguir.

### Development Principles

- **KISS (Keep It Simple, Stupid)**: Choose straightforward solutions over complex ones
- **YAGNI (You Aren't Gonna Need It)**: Implement features only when needed
- **Fail Fast**: Check for errors early and raise exceptions immediately
- **Single Responsibility**: Each component, function, and module has one clear purpose
- **Dependency Inversion**: High-level components depend on abstractions, not implementations
- **Consistency**: Follow established patterns in the existing codebase

## Project Structure

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS 4 with custom design system
- **Content**: Contentlayer + MDX for articles
- **Authentication**: NextAuth.js with Google OAuth
- **Email**: Resend for newsletter and notifications
- **Deployment**: Vercel with custom domain
- **Analytics**: Umami for privacy-focused tracking

### Key Directories

```
footballdecoded/
├── app/                    # Next.js App Router
│   ├── Main.tsx           # Homepage with featured articles
│   ├── about/             # Author bio and experience
│   ├── api/               # API endpoints
│   │   ├── auth/          # NextAuth configuration
│   │   ├── comments/      # Comment system endpoints
│   │   └── newsletter/    # Newsletter subscription
│   ├── blog/              # Blog system with sections
│   │   ├── player-decoded/
│   │   ├── match-analysis/
│   │   └── team-architecture/
│   ├── contact/           # Contact form
│   ├── newsletter/        # Newsletter pages
│   └── tags/              # Tag-based article filtering
├── components/             # Reusable React components
│   ├── AnalysisCarousel.tsx   # Carousel for analysis images
│   ├── ArticleCard.tsx        # Article preview cards
│   ├── ArticlesLayout.tsx     # Layout for articles listing
│   ├── AuthButton.tsx         # Authentication UI
│   ├── BioSection.tsx         # About page bio section
│   ├── CommentForm.tsx        # Comment submission form
│   ├── CommentsList.tsx       # Comments display component
│   ├── Footer.tsx             # Site footer
│   ├── GoalsCarousel.tsx      # Goals analysis carousel
│   ├── Header.tsx             # Site navigation header
│   ├── Image.tsx              # Next.js Image wrapper
│   ├── Link.tsx               # Next.js Link wrapper
│   ├── MDXComponents.tsx      # Custom MDX components
│   ├── MobileNav.tsx          # Mobile navigation menu
│   ├── NewsletterForm.tsx     # Newsletter subscription
│   ├── PhotoCarousel.tsx      # Photo carousel component
│   ├── ScrollTopAndComment.tsx # Scroll utilities
│   ├── SearchButton.tsx       # Search functionality
│   ├── SectionContainer.tsx   # Layout container
│   ├── SectionsNavigation.tsx # Section navigation
│   ├── SessionProvider.tsx    # Auth session provider
│   ├── SimpleTagLayout.tsx    # Tag page layout
│   ├── ThemeSwitch.tsx        # Dark/light theme toggle
│   └── social-icons/          # Social media icons
├── content/               # Blog content and configuration
│   ├── articles/          # MDX articles by section
│   │   ├── player-decoded/        # Player analysis section
│   │   ├── match-analysis/        # Match analysis section
│   │   └── team-architecture/     # Team architecture section
│   ├── headerNavLinks.ts  # Navigation configuration
│   └── siteMetadata.js    # Global site settings
├── layouts/               # Page layouts
│   └── PostLayout.tsx     # Article layout with TOC
├── public/static/         # Static assets
│   ├── images/            # Article images and assets
│   └── favicons/          # Site icons
└── scripts/               # Utility scripts
    ├── clear-comments.mjs      # Clear all comments utility
    ├── migrate-comments.mjs    # Comment migration script
    ├── newsletter-manager.mjs  # Newsletter management CLI
    ├── postbuild.mjs          # Post-build processing
    └── rss.mjs                # RSS feed generation
```

## Development Standards

### Code Style

```typescript
// Component naming: PascalCase
interface ArticleCardProps {
  article: Article
  featured?: boolean
  className?: string
}

export default function ArticleCard({
  article,
  featured = false,
  className = ''
}: ArticleCardProps) {
  return (
    <article className={`article-card ${className}`}>
      {/* Component content */}
    </article>
  )
}

// Custom hooks: use prefix
function useArticleData(slug: string) {
  // Hook implementation
}

// Utility functions: camelCase
function formatPublishDate(date: string): string {
  return new Date(date).toLocaleDateString('es-ES')
}

// Constants: UPPER_SNAKE_CASE
const MAX_ARTICLES_PER_PAGE = 6
const NEWSLETTER_API_ENDPOINT = '/api/newsletter/subscribe'
```

### File Naming Conventions

```bash
# Components: PascalCase
ArticleCard.tsx
NewsletterForm.tsx
CommentsList.tsx

# Pages: kebab-case
app/about/page.tsx
app/player-decoded/page.tsx

# Content: kebab-case
nuevo-articulo-ejemplo.mdx
otro-articulo-ejemplo.mdx

# Assets: kebab-case
imagen-ejemplo-articulo.jpg
otro-banner-ejemplo.png

# Utilities and configs: camelCase or kebab-case
siteMetadata.js
newsletter-manager.mjs
```

### Error Handling

```typescript
// API routes: structured error responses
try {
  const result = await processNewsletterSubscription(email)
  return NextResponse.json({ success: true, data: result })
} catch (error) {
  console.error('Newsletter subscription error:', error)
  return NextResponse.json(
    { error: 'Subscription failed', details: error.message },
    { status: 500 }
  )
}

// Client-side: user-friendly error states
const [error, setError] = useState<string | null>(null)

async function handleSubmit(formData: FormData) {
  try {
    setError(null)
    await submitComment(formData)
  } catch (err) {
    setError('No se pudo enviar el comentario. Inténtalo de nuevo.')
  }
}
```

### Content Structure

```typescript
// MDX frontmatter for articles (REQUIRED FIELDS)
---
title: 'Título del Artículo de Ejemplo'
date: '2024-01-15'
section: 'player-decoded' // player-decoded | match-analysis | team-architecture
image: '/static/images/articles/imagen-ejemplo.jpg'
tags: ['táctica', 'análisis', 'ejemplo']
summary: 'Resumen de ejemplo para un artículo del blog'
author: 'Jaime Oriol'
readingTime: '8 min'
featured: false // Optional: highlight on homepage
---

# Article content in MDX format
```

### Section Color Coding & Themes

```css
/* Player Decoded - Blue theme */
.player-decoded {
  --primary: theme(colors.sky.600);
  --primary-light: theme(colors.sky.100);
  --accent: theme(colors.sky.500);
}

/* Match Analysis - Green theme */
.match-analysis {
  --primary: theme(colors.emerald.600);
  --primary-light: theme(colors.emerald.100);
  --accent: theme(colors.emerald.500);
}

/* Team Architecture - Purple theme */
.team-architecture {
  --primary: theme(colors.indigo.600);
  --primary-light: theme(colors.indigo.100);
  --accent: theme(colors.indigo.500);
}
```

## Development Commands

### Package Management (npm)

```bash
# Install dependencies
npm install

# Add new package
npm install package-name

# Development dependency
npm install --save-dev package-name

# Update dependencies
npm update
```

### Common Development Tasks

```bash
# Development
npm start                # Start development server (localhost:3000)
npm run dev              # Alternative development command
npm run build            # Build for production with postbuild script
npm run serve            # Start production server

# Code Quality
npm run lint             # ESLint with auto-fix for pages, app, components, lib, layouts, scripts
npm run analyze          # Bundle analyzer for performance optimization
npm run prepare          # Husky git hooks setup

# Content & Newsletter
npm run newsletter       # Newsletter management CLI
# - node scripts/newsletter-manager.mjs list     # View subscriber statistics
# - node scripts/newsletter-manager.mjs export   # Export confirmed emails
# - node scripts/newsletter-manager.mjs test     # Test API connection
```

## Content Creation Workflow

### Adding New Articles

1. **Create MDX file** in appropriate section:

   ```bash
   content/articles/player-decoded/nuevo-analisis.mdx
   ```

2. **Add frontmatter** with all required fields
3. **Add article image** to:

   ```bash
   public/static/images/articles/nuevo-analisis.jpg
   ```

4. **Test locally**:

   ```bash
   npm run dev
   ```

5. **Verify build**:
   ```bash
   npm run build
   ```

### MDX Components Available

```mdx
<!-- Technical concepts with semantic highlighting -->

<TechnicalConcept type="metric">xG</TechnicalConcept>
<TechnicalConcept type="role">Mediocentro defensivo</TechnicalConcept>
<TechnicalConcept type="system">4-3-3</TechnicalConcept>

<!-- Callouts for insights -->

<Callout type="insight">Insight clave sobre el análisis táctico</Callout>

<Callout type="warning">Limitación importante de esta métrica</Callout>

<!-- Statistics cards -->

<StatCard
  title="Presión alta exitosa"
  value="78.4%"
  description="Porcentaje de recuperaciones en campo rival"
  trend="up"
/>

<!-- Technical quotes -->

<TechnicalQuote source="Autor Ejemplo">Cita de ejemplo para mostrar el componente</TechnicalQuote>

<!-- Image with caption -->

<Image
  src="/static/images/articles/pressure-map.jpg"
  alt="Mapa de presión del Manchester City"
  width={800}
  height={500}
  caption="Mapa de calor mostrando las zonas de presión del City"
/>
```

## Branch Strategy & Git Workflow

### Branch Naming Conventions

```
main (protected branch)
  ├── content/add-nuevo-articulo
  ├── feature/improve-newsletter-ui
  ├── fix/mobile-navigation-bug
  ├── style/update-article-cards
  └── docs/update-api-documentation
```

- `content/` - New articles or content updates
- `feature/` - New functionality
- `fix/` - Bug fixes
- `style/` - Design/styling improvements
- `docs/` - Documentation updates

### Workflow Steps

```bash
# 1. Start new task - always from main
git checkout main
git pull origin main
git checkout -b content/add-new-player-analysis

# 2. Work on content with incremental commits
git add content/articles/player-decoded/new-analysis.mdx
git commit -m "content: add player analysis structure"
git add public/static/images/articles/new-analysis.jpg
git commit -m "content: add featured image for tactical analysis"

# 3. Keep branch updated with main
git fetch origin
git rebase origin/main

# 4. Push to remote
git push origin content/add-new-player-analysis

# 5. After merge, cleanup
git checkout main
git pull origin main
git branch -d content/add-new-player-analysis
```

### Commit Message Format

Follow conventional commits specification:

```bash
# Format: <type>(<scope>): <subject>

# Types for blog content
content: New articles or content updates
feat: New features or functionality
fix: Bug fixes
style: Design and styling changes
docs: Documentation changes
refactor: Code improvements without changing functionality
perf: Performance improvements
chore: Maintenance tasks

# Examples
git commit -m "content: add new player analysis article"
git commit -m "feat(newsletter): add confirmation email template"
git commit -m "fix(mobile): resolve navigation menu positioning"
git commit -m "style(cards): improve article card hover effects"
git commit -m "docs: update MDX component usage guide"
```

## Configuration Management

### Environment Variables

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth (para sistema de comentarios)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Resend (para newsletter)
RESEND_API_KEY=your-resend-api-key
RESEND_AUDIENCE_ID=your-resend-audience-id

# Redis/Upstash (para newsletter)
REDIS_URL=your-redis-connection-string
# O alternativamente:
# KV_URL=your-upstash-kv-url

# Umami Analytics (opcional)
UMAMI_WEBSITE_ID=your-umami-website-id

# Base Path (para deployment personalizado)
BASE_PATH=
EXPORT=
UNOPTIMIZED=
```

### Site Metadata Configuration

```javascript
// content/siteMetadata.js
const siteMetadata = {
  title: 'FootballDecoded',
  author: 'Jaime Oriol',
  headerTitle: 'FootballDecoded',
  description: 'FootballDecoded',
  language: 'es-ES',
  locale: 'es-ES',
  theme: 'system',
  siteUrl: 'https://footballdecoded.com',
  siteRepo: 'https://github.com/jaime-oriol/FootballDecoded',
  siteLogo: `${process.env.BASE_PATH || ''}/static/images/logo.png`,
  socialBanner: `${process.env.BASE_PATH || ''}/static/images/football-decoded-banner.jpg`,
  email: 'joriolgo@gmail.com',
  github: 'https://github.com/jaime-oriol',
  x: 'https://x.com/_orio1',
  linkedin: 'https://www.linkedin.com/in/jaime-oriol-goicoechea-801313276/',
  instagram: 'https://www.instagram.com/orio1_/',
  analytics: {
    umamiAnalytics: {
      umamiWebsiteId: '00cdd21e-95b5-41a4-b2c1-aa12fd3fde2b',
      umamiSrc: 'https://cloud.umami.is/script.js',
    },
  },
  newsletter: {
    provider: 'resend',
  },
  comments: {
    giscusConfig: {
      repo: 'jaime-oriol/FootballDecoded',
      repositoryId: 'R_kgDOOxLT5g',
      category: 'General',
      categoryId: 'DIC_kwDOOxLT5s4Cqo_m',
      mapping: 'pathname',
      reactions: '1',
      metadata: '0',
      inputPosition: 'bottom',
      theme: 'preferred_color_scheme',
      lang: 'es',
      loading: 'lazy',
    },
  },
  search: {
    provider: 'kbar',
    kbarConfig: {
      searchDocumentsPath: `${process.env.BASE_PATH || ''}/search.json`,
    },
  },
}
```

## Newsletter System

### Management Commands

```bash
# View subscriber statistics
npm run newsletter list

# Export confirmed email addresses
npm run newsletter export

# Test Resend API connection
npm run newsletter test

# Custom newsletter management
node scripts/newsletter-manager.mjs --help
```

### Newsletter Workflow

1. **Subscription**: Users subscribe via NewsletterForm component
2. **Confirmation**: Email sent via Resend with confirmation link
3. **Management**: Use CLI tools to manage subscriber list
4. **Export**: Regular export for external email marketing tools

## Security Considerations

### API Security

```typescript
// Rate limiting for API endpoints
import { Ratelimit } from '@upstash/ratelimit'

const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '1 m'), // 5 requests per minute
})

// Input validation
import { z } from 'zod'

const newsletterSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(2, 'Nombre requerido'),
})
```

### Content Security

- Never expose API keys in client-side code
- Validate all user inputs (comments, newsletter)
- Sanitize MDX content before rendering
- Use environment variables for sensitive data
- Regular dependency updates for security patches

### Privacy Compliance

- Newsletter: Double opt-in confirmation required
- Comments: Optional authentication, no required personal data
- Analytics: Privacy-focused (Umami), no personal data collection
- Cookies: Only essential cookies, clear cookie policy

## Performance Optimization

### Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image'

<Image
  src="/static/images/articles/player-analysis.jpg"
  alt="Player analysis diagram"
  width={800}
  height={400}
  priority // For above-the-fold images
  placeholder="blur" // Optional: blur placeholder
/>
```

### Bundle Optimization

```bash
# Analyze bundle size
npm run analyze

# Key optimization areas:
# - Code splitting at route level (automatic with App Router)
# - Dynamic imports for heavy components
# - Image optimization with Next.js Image
# - CSS purging with Tailwind
```

## Testing Strategy

### Content Testing

```bash
# Build test - ensures no compilation errors
npm run build

# Link checking (manual)
# - Verify all internal links work
# - Check external links periodically
# - Test newsletter signup flow
# - Verify comment submission
```

### Cross-browser Testing

- Test on Chrome, Firefox, Safari, Edge
- Mobile testing on iOS Safari and Android Chrome
- Verify responsive design at different breakpoints
- Test newsletter and comment forms

## Deployment

### Next.js Configuration

```javascript
// next.config.js - Tailwind CSS 4 compatible
const { withContentlayer } = require('next-contentlayer2')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

// Security headers with CSP
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' giscus.app analytics.umami.is;",
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
]

module.exports = () => {
  const plugins = [withContentlayer, withBundleAnalyzer]
  return plugins.reduce((acc, next) => next(acc), {
    reactStrictMode: true,
    trailingSlash: false,
    pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
    images: {
      remotePatterns: [
        { protocol: 'https', hostname: 'picsum.photos' },
        { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
        { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      ],
    },
    async headers() {
      return [{ source: '/(.*)', headers: securityHeaders }]
    },
  })
}
```

### Deployment Checklist

1. **Environment Variables**: Set all required vars in Vercel dashboard
2. **Domain Configuration**: Point footballdecoded.com to Vercel
3. **Analytics**: Configure Umami tracking
4. **Email**: Verify Resend configuration
5. **Content**: Test article rendering and newsletter signup
6. **Performance**: Run Lighthouse audit
7. **SEO**: Verify meta tags, sitemap, robots.txt

### Monitoring

- **Vercel Analytics**: Monitor performance and Core Web Vitals
- **Umami**: Track page views and user engagement
- **Resend Dashboard**: Monitor email delivery rates
- **Manual Testing**: Regular content and feature testing

## Claude Code Configuration

### Initial Setup

```bash
# Skip permission prompts for faster workflow
claude --dangerously-skip-permissions

# Configure terminal for better experience
/terminal-setup

# Clear chat between different tasks
/clear
```

### Best Practices

**File Operations**

- Shift+drag to reference files (not regular drag)
- Control+V to paste images (not Command+V)
- Use `@filename` to reference specific files

**Chat Management**

- Queue multiple prompts for batch processing
- Escape to stop Claude (not Control+C)
- Escape twice to see message history
- Up arrow to navigate previous commands

**Project Context (CLAUDE.md)**

- Root `CLAUDE.md` provides project overview and standards
- Always reference these guidelines before starting work
- Update this file when project conventions change

## Contributing Guidelines

### Code Review Criteria

- **Functionality**: Does the code work as intended?
- **Performance**: Are there any performance implications?
- **Security**: Any security vulnerabilities or best practices violations?
- **Accessibility**: Does the UI meet accessibility standards?
- **SEO**: Are meta tags and structured data correct?
- **Content Quality**: Is written content clear and professional?
- **Code Style**: Does it follow the established conventions?

### Review Process

1. **Self-review**: Test locally, check console for errors
2. **Content Review**: Verify article formatting and links
3. **Performance Check**: Run build and check for warnings
4. **Mobile Test**: Verify responsive design
5. **SEO Check**: Verify meta tags and descriptions
6. **Accessibility**: Check color contrast and keyboard navigation

---

**Remember**: This guide is the single source of truth for FootballDecoded development. Keep it updated as the project evolves. When using Claude Code, reference this guide for consistent development practices and maintain the high quality standards expected for a professional football analysis blog.
