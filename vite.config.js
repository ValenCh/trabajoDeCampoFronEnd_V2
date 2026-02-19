import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: 5173,
  },
  server: {
    port: 5173,
    proxy: {
      '/auth': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
      // Agregamos proxy para el resto de la API también, para evitar problemas de CORS en desarrollo
      '/administrador': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
      '/director': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
      '/vicedirector': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      },
      '/integrante': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})