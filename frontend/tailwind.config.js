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
          50: '#FFFEFA',
          100: '#FDFBF4',
          200: '#FBF5E5',
          300: '#F5ECE0',
          400: '#EAD7BD',
        },
        turmeric: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        terracotta: {
          500: '#C2410C',
          600: '#9A3412',
          700: '#7C2D12',
          800: '#5C1D06',
        },
        heritage: {
          maroon: '#4A1515',
          gold: '#C89B3C',
          deepBrown: '#2D1810',
          sand: '#EFE7DA',
          olive: '#2D4A22',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'premium': '0 20px 40px -15px rgba(120, 53, 15, 0.12), 0 0 15px rgba(217, 119, 6, 0.05)',
        'card-hover': '0 25px 50px -12px rgba(120, 53, 15, 0.18)',
        'gold-glow': '0 0 25px rgba(245, 158, 11, 0.35)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.9', transform: 'scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
