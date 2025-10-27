import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => ({
  // Default: use '/' for dev and local build/preview
  // For GitHub Pages build, run with --mode gh to set base '/frontendAS/'
  base: command === 'build' ? (mode === 'gh' ? '/frontendAS/' : '/') : '/',
  plugins: [react()],
}))
