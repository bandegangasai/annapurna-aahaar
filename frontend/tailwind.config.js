/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF6EE',
          200: '#F4EBD9',
          300: '#EBDCC2',
          400: '#DECAAA',
          500: '#CDB38C',
        },
        heritage: {
          maroon: '#4A0E17',
          darkMaroon: '#360910',
          richRed: '#6B1624',
          gold: '#C89B3C',
          brightGold: '#D4AF37',
          antiqueGold: '#B38022',
          sand: '#FAF6EE',
          terracotta: '#9A3412',
          darkBrown: '#2B170F',
          forestGreen: '#244033',
        },
        turmeric: {
          50: '#FFFDF0',
          100: '#FEF9D9',
          200: '#FDEFB3',
          300: '#FCE182',
          400: '#F5C84C',
          500: '#E5A91E',
          600: '#C89B3C',
          700: '#A6791E',
          800: '#855C15',
          900: '#69460D',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'antique': '0 20px 45px -15px rgba(54, 9, 16, 0.18), 0 0 15px rgba(200, 155, 60, 0.1)',
        'card-lift': '0 25px 50px -12px rgba(43, 23, 15, 0.22)',
        'gold-glow': '0 0 25px rgba(200, 155, 60, 0.4)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 25s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
