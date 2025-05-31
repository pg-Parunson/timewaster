import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/database']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true, // 🔥 production에서 console.* 제거
        drop_debugger: true // debugger 문도 제거
      }
    }
  },
  server: {
    port: 3000,
    host: true
  },
  define: {
    __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production')
  }
})
