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
          50: '#F3F6F4',
          100: '#E4ECE6',
          200: '#C7D7CC',
          300: '#9FBBA6',
          400: '#6F9979',
          500: '#477852',
          600: '#345E3D',
          700: '#2A4B31',
          800: '#243B2A', // Primary Deep Forest
          900: '#1D3022',
          950: '#0F1B12',
        },
        olive: {
          50: '#F6F7F4',
          100: '#E9EBE4',
          200: '#D4D9CC',
          300: '#B6BFA9',
          400: '#94A083',
          500: '#768364',
          600: '#66735A', // Core Olive
          700: '#515C47',
          800: '#414A39',
          900: '#363E30',
        },
        sage: {
          50: '#F7F8F5',
          100: '#ECEFE8',
          200: '#DCE2D4',
          300: '#C5CDBA',
          400: '#A8B29A', // Core Sage
          500: '#8E9A7E',
          600: '#717D62',
          700: '#58624C',
        },
        sand: {
          50: '#FAF8F4',
          100: '#F3EFE6', // Warm Beige
          200: '#E7DFCFC',
          300: '#D8CDBB', // Core Sand
          400: '#BFB09A',
          500: '#A3927A',
          600: '#86765F',
          700: '#6A5C4A',
        },
        terracotta: {
          50: '#FAF2EE',
          100: '#F5E4DC',
          200: '#EAC8B9',
          300: '#DCA691',
          400: '#CA8368',
          500: '#B86B4B', // Core Terracotta
          600: '#A35637',
          700: '#864329',
          800: '#6E3823',
          900: '#441E11',
        },
        earth: {
          50: '#FAF8F3', // Off White canvas
          100: '#F3EFE6', // Warm Beige
          200: '#E8E1D5', // Subtle card border
          300: '#D8CDBB', // Sand
          400: '#B5A693',
          500: '#8D7C68',
          600: '#6E5F4E',
          700: '#544739',
          800: '#3B3028', // Dark Brown text
          900: '#2A221C',
          950: '#1B1511',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(59, 48, 40, 0.05)',
        'card': '0 1px 3px 0 rgba(59, 48, 40, 0.06), 0 1px 2px -1px rgba(59, 48, 40, 0.04)',
        'card-hover': '0 4px 12px -2px rgba(59, 48, 40, 0.10), 0 2px 6px -2px rgba(59, 48, 40, 0.05)',
        'modal': '0 20px 25px -5px rgba(36, 59, 42, 0.25), 0 8px 10px -6px rgba(36, 59, 42, 0.15)',
      }
    },
  },
  plugins: [],
}


