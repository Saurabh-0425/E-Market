/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        serif: ['Newsreader', 'Georgia', 'serif'],
      },
      colors: {
        ink: { 900: '#0f1720', 800: '#16212c', 700: '#223140', 500: '#5b6b7b', 300: '#a6b1bd' },
        gold: { 400: '#f2b42d', 500: '#e0a01a' },
        mist: '#f3f5f7',
      },
    },
  },
  plugins: [],
};
