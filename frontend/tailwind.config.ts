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
        // Palette Hornets Taekwondo
        hornets: {
          yellow:  '#F5A623',
          'yellow-light': '#FFD166',
          'yellow-dark':  '#C47D10',
          black:   '#0A0A0A',
          'black-soft': '#1A1A1A',
          'black-card': '#111111',
          red:     '#D0021B',
          gray:    '#2A2A2A',
          'gray-light': '#3A3A3A',
          white:   '#F9F9F9',
        },
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-bebas)', 'var(--font-inter)', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fade-in':      'fadeIn 0.6s ease-out forwards',
        'slide-up':     'slideUp 0.6s ease-out forwards',
        'slide-in-left':'slideInLeft 0.6s ease-out forwards',
        'pulse-yellow': 'pulseYellow 2s ease-in-out infinite',
        'spin-slow':    'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(40px)', opacity: '0' },
          to:   { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-40px)', opacity: '0' },
          to:   { transform: 'translateX(0)', opacity: '1' },
        },
        pulseYellow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245, 166, 35, 0.4)' },
          '50%':      { boxShadow: '0 0 0 20px rgba(245, 166, 35, 0)' },
        },
      },
      backgroundImage: {
        'gradient-radial':   'radial-gradient(var(--tw-gradient-stops))',
        'gradient-diagonal': 'linear-gradient(135deg, var(--tw-gradient-stops))',
        'noise':             "url('/images/noise.png')",
      },
      boxShadow: {
        'yellow-glow': '0 0 30px rgba(245, 166, 35, 0.3)',
        'yellow-glow-lg': '0 0 60px rgba(245, 166, 35, 0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.4)',
        'card-hover': '0 12px 48px rgba(0,0,0,0.6)',
      },
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [],
};

export default config;
