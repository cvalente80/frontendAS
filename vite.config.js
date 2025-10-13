import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // Use '/' in dev and '/frontendAS/' only for production build (e.g., GitHub Pages)
  base: command === 'build' ? '/frontendAS/' : '/',
  plugins: [react()],
}))
