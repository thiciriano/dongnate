/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dn-green': '#1A6B3C',
        'dn-green-dark': '#0D361E',
        'dn-green-pale': '#E8F5EE',
        'dn-amber': '#D97706',
        'dn-amber-dark': '#92400E',
        'dn-amber-light': '#F59E0B',
        'dn-cream': '#FAFAF7',
        'dn-error': '#DC2626',
        'dn-ink-mid': '#4B5563',
        'dn-ink-soft': '#9CA3AF',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'dmsans': ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        '3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        '4xl': '0 50px 100px -20px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'fade-in-left': 'fadeInLeft 1s ease-out forwards',
        'float': 'floating 4s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        floating: {
          '0%, 100%': { transform: 'translateY(0) rotate(-6deg)' },
          '50%': { transform: 'translateY(-20px) rotate(-4deg)' },
        }
      }
    },
  },
  plugins: [],
}
