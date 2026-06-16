/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#198038',
        primaryHover: '#14562c',
        secondary: '#ff832b',
        secondaryHover: '#e06722',
        alert: '#ff5a1f',
        neutral: {
          light: '#f7f6f3',
          charcoal: '#161616',
        },
        energy: '#009d9a',
        transport: '#1192e8',
        waste: '#6929c4',
      },
    },
  },
  plugins: [],
}
