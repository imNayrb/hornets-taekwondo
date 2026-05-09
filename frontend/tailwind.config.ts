import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        hornets: {
          // Accenti
          yellow:       '#F5A623',
          'yellow-light': '#FFD166',
          'yellow-dark':  '#E08C00',
          'yellow-pale':  '#FFF8EC',
          // Testo
          ink:          '#0D0D0D',
          'ink-soft':   '#3D3D3D',
          'ink-muted':  '#6B7280',
          // Superfici (light theme)
          bg:           '#F7F8FA',
          surface:      '#FFFFFF',
          'surface-2':  '#F0F2F5',
          // Bordi
          border:       '#E8EAF0',
          'border-dark':'#D1D5DB',
          // Accento dark per contrasto
          dark:         '#0F0F1A',
          'dark-card':  '#1A1A2E',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 7vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-lg': ['clamp(2.2rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.025em' }],
        'display-md': ['clamp(1.8rem, 3.5vw, 2.8rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      animation: {
        'fade-up':      'fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':      'fadeIn 0.5s ease-out forwards',
        'scale-in':     'scaleIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'float':        'float 6s ease-in-out infinite',
        'float-slow':   'float 9s ease-in-out infinite',
        'pulse-soft':   'pulseSoft 3s ease-in-out infinite',
        'shimmer':      'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.92)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to:   { backgroundPosition: '200% 0' },
        },
      },
      boxShadow: {
        'soft':      '0 2px 16px rgba(0,0,0,0.06)',
        'medium':    '0 8px 32px rgba(0,0,0,0.10)',
        'large':     '0 24px 64px rgba(0,0,0,0.12)',
        'yellow':    '0 8px 32px rgba(245,166,35,0.25)',
        'yellow-lg': '0 16px 48px rgba(245,166,35,0.35)',
        'inset-sm':  'inset 0 1px 2px rgba(0,0,0,0.06)',
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'mesh-1': 'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(245,166,35,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 20%, rgba(245,166,35,0.08) 0%, transparent 50%)',
        'mesh-hero': 'radial-gradient(ellipse 70% 70% at 60% 30%, rgba(245,166,35,0.15) 0%, transparent 55%), radial-gradient(ellipse 50% 60% at 10% 80%, rgba(15,15,26,0.05) 0%, transparent 50%)',
      },
      screens: { xs: '480px' },
    },
  },
  plugins: [],
};

export default config;
