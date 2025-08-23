# CLAUDE.md - FootballDecoded Blog Development Guide

## Core Philosophy

**Ve paso a paso, uno a uno. Despacio es el camino más rápido. Escribe siempre el código lo más compacto y conciso posible, y que cumpla exactamente lo pedido al 100%. Sin emojis ni florituras. Usa nombres claros y estándar. Incluye solo comentarios útiles y necesarios.**

### Development Principles

- **KISS (Keep It Simple, Stupid)**: Choose straightforward solutions over complex ones
- **YAGNI (You Aren't Gonna Need It)**: Implement features only when needed
- **Single Responsibility**: Each component and function has one clear purpose
- **Consistency**: Follow established patterns in the existing codebase

## Project Structure

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Content**: Contentlayer + MDX
- **Authentication**: NextAuth.js with Google OAuth
- **Email**: Resend for newsletter

### Key Directories
```
app/                    # Next.js app router pages
├── blog/              # Blog system with sections
├── api/               # API endpoints
└── Main.tsx           # Homepage

components/             # Reusable React components
content/               # Blog content and config
├── articles/          # MDX articles by section
│   ├── tactical-analysis/
│   ├── analytical-scouting/
│   └── advanced-metrics/
└── siteMetadata.js    # Site configuration

layouts/               # Page layouts
public/static/         # Static assets
```

## Development Standards

### Code Style

```typescript
// Component naming: PascalCase
export default function ArticleCard({ article }: ArticleCardProps) {
  return <div className="article-card">...</div>
}

// Props interfaces
interface ArticleCardProps {
  article: Article
  featured?: boolean
}

// File naming: kebab-case for pages, PascalCase for components
// app/about/page.tsx
// components/ArticleCard.tsx
```

### Content Structure

```typescript
// MDX frontmatter for articles
---
title: 'Análisis Táctico del 4-3-3 de Guardiola'
date: '2024-01-15'
section: 'tactical-analysis' // tactical-analysis | analytical-scouting | advanced-metrics
image: '/static/images/articles/guardiola-tactics.jpg'
tags: ['táctica', 'guardiola', '4-3-3']
summary: 'Análisis detallado del sistema posicional de Guardiola'
---
```

### Section Color Coding
- **tactical-analysis**: Blue (sky colors)
- **analytical-scouting**: Green (emerald colors)  
- **advanced-metrics**: Purple (indigo colors)

## Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # ESLint with auto-fix
npm run analyze          # Bundle analyzer

# Content Management
npm run newsletter       # Newsletter management scripts
```

## Content Creation

### Adding New Articles

1. Create MDX file in appropriate section: `content/articles/[section]/article-name.mdx`
2. Add frontmatter with required fields
3. Add corresponding image to `public/static/images/articles/`
4. Test locally with `npm run dev`

### MDX Components Available

```mdx
<TechnicalConcept type="metric">xG</TechnicalConcept>
<TechnicalConcept type="role">Mediocentro defensivo</TechnicalConcept>

<Callout type="insight">
Insight importante del análisis
</Callout>

<StatCard 
  title="Presión alta exitosa"
  value="78.4%"
  description="Recuperaciones en campo rival"
/>
```

## Git Workflow

### Branch Naming
- `content/` - New articles or content updates
- `feature/` - New functionality  
- `fix/` - Bug fixes
- `style/` - Design/styling updates

### Commit Format
```bash
# Examples
git commit -m "content: add tactical analysis of City vs Arsenal"
git commit -m "feat: improve newsletter subscription flow"
git commit -m "fix: resolve mobile navigation issue"
git commit -m "style: update article card spacing"
```

## Environment Variables

Required for local development:
```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Resend (Newsletter)
RESEND_API_KEY=your-resend-api-key
```

## Deployment

- **Platform**: Vercel with automatic deployments
- **Domain**: footballdecoded.com
- **Branch**: `main` for production
- Set all environment variables in Vercel dashboard

---

**Remember**: This guide is specific to the FootballDecoded blog. Follow these conventions to maintain consistency across the project.