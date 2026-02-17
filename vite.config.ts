import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // For user/organization site (aminuddin1234.github.io), base is '/'
  // If deploying to a project site (e.g., aminuddin1234.github.io/portfolio), change to '/portfolio/'
  base: '/',
})
