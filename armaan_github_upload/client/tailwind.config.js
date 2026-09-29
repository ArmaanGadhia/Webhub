/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stitch Design System Colors
        surface: '#0f131d',
        'surface-dim': '#0f131d',
        'surface-bright': '#353944',
        'surface-container-lowest': '#0a0e18',
        'surface-container-low': '#171b26',
        'surface-container': '#1c1f2a',
        'surface-container-high': '#262a35',
        'surface-container-highest': '#313540',
        'on-surface': '#dfe2f1',
        'on-surface-variant': '#c7c4d7',
        'inverse-surface': '#dfe2f1',
        'inverse-on-surface': '#2c303b',
        outline: '#908fa0',
        'outline-variant': '#464554',
        'surface-tint': '#c0c1ff',
        primary: '#c0c1ff',
        'on-primary': '#1000a9',
        'primary-container': '#8083ff',
        'on-primary-container': '#0d0096',
        'inverse-primary': '#494bd6',
        secondary: '#4cd7f6',
        'on-secondary': '#003640',
        'secondary-container': '#03b5d3',
        'on-secondary-container': '#00424e',
        tertiary: '#4edea3',
        'on-tertiary': '#003824',
        'tertiary-container': '#00885d',
        'on-tertiary-container': '#000703',
        error: '#ffb4ab',
        'on-error': '#690005',
        'error-container': '#93000a',
        'on-error-container': '#ffdad6',
        
        // Brand Electric Indigo
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: {
        gutter: '1rem',
        'gutter-dense': '0.5rem',
      },
      boxShadow: {
        'glow-indigo': '0 0 16px -4px rgba(99, 102, 241, 0.15)',
        'glow-emerald': '0 0 8px rgba(16, 185, 129, 0.6)',
      }
    },
  },
  plugins: [],
}
