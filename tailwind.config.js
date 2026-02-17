/** @type {import('tailwindcss').Config} */
export default {
  content: [
    \"./index.html\",
    \"./src/**/*.{js,ts,jsx,tsx}\",
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0a0a0f',
        'bg-secondary': '#12121a',
        'bg-card': '#1a1a24',
        'accent-primary': '#00d4ff',
        'accent-secondary': '#7c3aed',
        'text-primary': '#f0f0f5',
        'text-secondary': '#a0a0b0',
        'border-color': '#2a2a3a',
      },
    },
  },
  plugins: [],
}
