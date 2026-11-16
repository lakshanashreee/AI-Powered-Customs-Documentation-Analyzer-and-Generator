/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ups: {
          brown: {
            DEFAULT: '#351C15',
            dark: '#24120B',
            light: '#4E2B21',
            hover: '#42241B'
          },
          gold: {
            DEFAULT: '#FFB500',
            hover: '#ECA700',
            light: '#FFF8E6',
            border: '#F6C343',
            dark: '#D99800'
          },
          bg: {
            page: '#FBF9F5',
            card: '#FFFFFF',
            warm: '#F7F3EB',
            subtle: '#FAF6EE'
          },
          border: {
            light: '#EBE5D8',
            DEFAULT: '#DDD5C7',
            focus: '#FFB500'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}

