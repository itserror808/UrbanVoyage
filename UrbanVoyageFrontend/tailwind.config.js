/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class', // Enable dark mode with a 'class' strategy
  theme: {
    extend: {
      colors: {
        //TEXT AND BACKGROUND
        lightBackground: '#F3F3F3',
        lightText: '#131313',
        darkBackground: '#131313',
        darkText: '#F3F3F3',


        //COLOR PALET
        skyBlue: '#4A90E2',
        sageGreen: '#7ED321',
        sunsetOrange: '#F5A623',
        sandWhite: '#F8F8F8',
        slateGray: '#8E8E93',

        //IDK WHAT TF CLAUDE DID HERE
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      }
    },
  },
  plugins: [],
}
