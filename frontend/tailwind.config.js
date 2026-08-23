/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#F2F7F5',
          100: '#E1EFEA',
          200: '#C2DFD6',
          300: '#94C6B7',
          400: '#5FA892',
          500: '#3D8C75',
          600: '#2C6F5C',
          700: '#235849',
          800: '#1C463A',
          900: '#173F35', // Primary Deep Forest Green
          950: '#0C241E',
        },
        gold: {
          50: '#FAF6EE',
          100: '#F4EBDA',
          200: '#EAD7B2',
          300: '#DFC17B',
          400: '#D5AD56',
          500: '#C79A45', // Secondary Antique Gold
          600: '#B08035',
          700: '#8C6228',
          800: '#6C4A20',
          900: '#54391A',
        },
        ivory: {
          50: '#FCFAF6',
          100: '#F8F3E7', // Primary Warm Ivory Background
          200: '#F1E9D5',
          300: '#E7DCBE',
          400: '#DAC9A2',
          500: '#CBB484',
        },
        terracotta: {
          50: '#FBF5F2',
          100: '#F5E8E2',
          200: '#EBD1C5',
          300: '#DCB09C',
          400: '#C7856A',
          500: '#A65332', // Accent Terracotta
          600: '#8E4124',
          700: '#73331C',
          800: '#5A2817',
          900: '#472114',
        },
        stone: {
          primary: '#252525',
          muted: '#5F5A50',
        },
        cream: {
          50: '#FDFBF7',
          100: '#F8F3E7',
          200: '#F1E9D5',
          300: '#E7DCBE',
          400: '#DAC9A2',
          500: '#CBB484',
        },
        heritage: {
          forest: '#173F35',
          forestDark: '#0C241E',
          gold: '#C79A45',
          brightGold: '#D8AF5D',
          antiqueGold: '#C79A45',
          ivory: '#F8F3E7',
          sand: '#FAF6EE',
          terracotta: '#A65332',
          maroon: '#173F35', // Map to Deep Forest Green for elegance
          darkMaroon: '#0C241E',
          richRed: '#A65332',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        devanagari: ['"Noto Sans Devanagari"', 'Inter', 'sans-serif'],
        telugu: ['"Noto Sans Telugu"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'antique': '0 20px 45px -15px rgba(23, 63, 53, 0.15), 0 0 15px rgba(199, 154, 69, 0.12)',
        'card-lift': '0 20px 40px -12px rgba(23, 63, 53, 0.18)',
        'gold-glow': '0 0 20px rgba(199, 154, 69, 0.35)',
        'subtle': '0 4px 20px -2px rgba(23, 63, 53, 0.06)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 30s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
}
