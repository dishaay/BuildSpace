import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Any request the frontend makes to a path starting with /api gets
    // forwarded to the backend. This means axios.post("/api/auth/login", ...)
    // "just works" during development with no CORS setup needed, and no
    // separate base URL to configure — the browser thinks it's all one server.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      // Uploaded post images are served from the backend at /uploads/...
      // — without this, the browser tries to load them from Vite's own
      // dev server (5173), where they don't exist.
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})