/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      animation: { 'spin-slow': 'spin 3s linear infinite' }
    },
  },
  plugins: [],
}