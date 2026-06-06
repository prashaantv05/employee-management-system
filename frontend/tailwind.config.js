/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: 'rgba(255, 255, 255, 0.08)',
        glassBorder: 'rgba(255, 255, 255, 0.12)',
        glassDark: 'rgba(15, 23, 42, 0.6)',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(59, 130, 246, 0.5)',
      }
    },
  },
  plugins: [],
}
