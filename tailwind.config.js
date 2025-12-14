/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#050505', // Deep Noir
          light: '#1A1A1A',   // Soft Black
          lighter: '#2B2B2B',
        },
        accent: {
          DEFAULT: '#D4AF37', // Metallic Gold
          light: '#F3E5AB',   // Champagne Gold
          dark: '#AA8C2C',    // Antique Gold
        },
        surface: {
          DEFAULT: '#121212',
          light: '#1E1E1E',
        },
        'off-white': '#F9F9F9',
        'gray-light': '#B0B0B0',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-premium': 'linear-gradient(to bottom, #050505 0%, #121212 100%)',
        'gradient-gold': 'linear-gradient(135deg, #BF953F 0%, #FCF6BA 25%, #B38728 50%, #FBF5B7 75%, #AA771C 100%)',
        'gradient-gold-hover': 'linear-gradient(135deg, #FCF6BA 0%, #BF953F 100%)',
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(212, 175, 55, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'sm': '0 2px 8px rgba(0, 0, 0, 0.12)',
        'md': '0 4px 16px rgba(0, 0, 0, 0.18)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.24)',
      },
      spacing: {
        'xs': '8px',
        'sm': '12px',
        'md': '20px',
        'lg': '28px',
        'xl': '40px',
        '2xl': '56px',
      },
      borderRadius: {
        'sm': '8px',
        'md': '14px',
        'lg': '20px',
        'xl': '28px',
      }
    },
  },
  plugins: [],
}
