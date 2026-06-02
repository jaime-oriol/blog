import type { Config } from 'tailwindcss'

export default {
  theme: {
    screens: {
      sm: '540px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    extend: {
      colors: {
        fd: '#0043D8',
        'fd-light': '#E6EEFF',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-in': 'slideIn 0.4s ease-out',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-links': '#0043D8',
            '--tw-prose-invert-links': '#E6EEFF',
          },
        },
      },
    },
  },
} satisfies Config
