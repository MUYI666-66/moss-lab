/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ["'DM Serif Display'", "'Noto Serif SC'", 'serif'],
        body: ["'Noto Sans SC'", 'system-ui', 'sans-serif'],
        mono: ["'JetBrains Mono'", "'Fira Code'", 'monospace'],
      },
      colors: {
        moss: {
          bg: '#080A08',
          surface: '#0B0F0C',
          card: '#111411',
          accent: '#7FA36B',
          'accent-light': '#A4C783',
          'accent-pale': '#D8E6C3',
          text: '#F2F2E8',
          muted: '#8E958B',
          danger: '#e53935',
          warning: '#ff9800',
          success: '#43a047',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease-out forwards',
        'grow-bar': 'growBar 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
        'count-in': 'countIn 0.6s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        growBar: {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.4', transform: 'scale(0.6)' },
        },
        countIn: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
