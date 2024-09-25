/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat'],
      },
      colors: {
        primary: '#121E6C',
        secondary: '#EE424E',
        'grey-dark': '#606060',
        'grey-light': '#F3f3f3',
        'bg-color': '#F6F4F9',
      }

    },
  },
  plugins: [],
}

