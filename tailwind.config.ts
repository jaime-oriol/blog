import type { Config } from 'tailwindcss'

export default {
  theme: {
    screens: {
      sm: '540px', // Menú horizontal y cards horizontal desde tablets pequeñas
      md: '768px', // Tablet estándar
      lg: '1024px', // Desktop
      xl: '1280px', // Desktop XL
    },
  },
} satisfies Config
