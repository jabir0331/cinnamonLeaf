/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'warm-brown': {
          50: '#faf8f5',
          100: '#f4f0e8',
          200: '#e8ddc7',
          300: '#d6c39e',
          400: '#c4a574',
          500: '#b08d56',
          600: '#9e7a4a',
          700: '#84633f',
          800: '#6b5137',
          900: '#57422f',
        },
        'sage-green': {
          50: '#f6f7f4',
          100: '#e9ede3',
          200: '#d4dcc8',
          300: '#b6c4a4',
          400: '#96a87d',
          500: '#7a8f5e',
          600: '#647349',
          700: '#505a3c',
          800: '#424933',
          900: '#393f2d',
        },
        'cream': {
          50: '#fefef9',
          100: '#fcfcf0',
          200: '#f9f8e1',
          300: '#f4f1ca',
          400: '#ece6aa',
          500: '#e1d788',
          600: '#d1c464',
          700: '#c0af46',
          800: '#9d8f3b',
          900: '#827534',
        }
      },
      fontFamily: {
        'display': ['Georgia', 'serif'],
        'body': ['Poppins', 'sans-serif'],
      }
    },
  },
  plugins: [],
};