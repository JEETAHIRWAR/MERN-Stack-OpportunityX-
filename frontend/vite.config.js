import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 2000, // Set the chunk size limit to 2000 KB
  },
  server: {
    historyApiFallback: true,
    proxy: {
      '/api': 'http://localhost:8001',
    }
  },
})
