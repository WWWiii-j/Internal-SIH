/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        earth: {
          50: '#FAF8F5',
          100: '#F4EFEA',
          200: '#E7DFD5',
          300: '#D5C7B7',
          400: '#B8A48F',
          500: '#8C7662',
          600: '#6E5C4B',
          700: '#544639',
          800: '#3D332A',
          900: '#26201A',
          950: '#17130F',
        },
        forest: {
          50: '#F2F7F4',
          100: '#E1EFE7',
          200: '#C3DFCE',
          600: '#2D6A4F',
          700: '#1E4D38',
          800: '#143728',
          900: '#0C241A',
        },
        terracotta: {
          50: '#FDF6F3',
          100: '#F9ECE5',
          200: '#F2D7C9',
          600: '#C2410C',
          700: '#9A3412',
          800: '#7C2D12',
          900: '#431407',
        },
        ochre: {
          50: '#FEFBF3',
          100: '#FDF6E3',
          600: '#B45309',
          700: '#92400E',
          800: '#78350F',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif']
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(38, 32, 26, 0.06)',
        'elevated': '0 12px 24px -4px rgba(38, 32, 26, 0.08), 0 4px 8px -2px rgba(38, 32, 26, 0.04)',
      }
    },
  },
  plugins: [],
}
