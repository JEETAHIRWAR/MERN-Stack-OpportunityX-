import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 2000, // Set the chunk size limit to 2000 KB
  },
  server: {
    proxy: {
      '/api/jobs': 'http://localhost:3000',
    }
  },
})
