/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#2563eb', // blue-600
          dark: '#60a5fa',  // blue-400
        },
        background: {
          light: '#ffffff',
          dark: '#000000',
        },
        surface: {
          light: '#f3f4f6', // gray-100
          dark: '#1A1A1A',
        },
        text: {
          light: '#1f2937', // gray-800
          dark: '#ffffff',  // Changed to white for better visibility in dark mode
        }
      }
    },
  },
  plugins: [],
} 