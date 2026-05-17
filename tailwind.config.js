/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
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
        },
      },
    },
  },
  plugins: [],
};
