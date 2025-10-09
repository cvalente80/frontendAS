import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/frontendAS/', // substitua pelo nome exato do repositório (ex.: '/frontendAS/')
  plugins: [react()],
})
