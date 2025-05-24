import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/timewaster/',
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    host: true
  }
})