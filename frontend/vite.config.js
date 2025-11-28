import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // CRITICAL: Explicitly set the port to 5173 to match Java CORS rules
    port: 5173, 
    proxy: {
      // All requests starting with /api are forwarded to the Java backend
      '/api': {
        target: 'http://localhost:8080', 
        changeOrigin: true,
        secure: false,
      }
    }
  }
})