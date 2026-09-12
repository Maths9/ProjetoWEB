/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#c47a85',
          dark: '#b5606e',
          light: '#f5d5d8',
        },
        sidebar: {
          DEFAULT: '#2d1f22',
          light: '#3d2a2e',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#c47a85',
          600: '#b5606e',
          700: '#9f3a4a',
        }
      },
    },
  },
  plugins: [],
}
