import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  preview: {
    port: 80,
    strictPort: true,
    host: true
  },
  server: {
    proxy: {
      '/api/': {
        target: 'http://158.160.112.90:8000/',
        changeOrigin: true,
        pathRewrite: { '^/api/': '' },
      },
    },
  },
})
