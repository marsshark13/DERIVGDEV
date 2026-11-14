/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        deriv: {
          red: '#FF444F',
          darkRed: '#D42D38',
          lightRed: '#FF6B75',
          black: '#0E0E0E',
        },
        cyber: {
          dark: '#080C14',
          card: '#0F172A',
          cardHover: '#17223B',
          border: '#1E293B',
          borderHover: '#334155',
          accent: '#38BDF8',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        }
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan-line': 'scan 2.5s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        scan: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '0.2' },
          '50%': { transform: 'translateY(100%)', opacity: '0.8' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(255, 68, 79, 0.2)' },
          '100%': { boxShadow: '0 0 30px rgba(255, 68, 79, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
