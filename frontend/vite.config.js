import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173, // default Vite port
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend API (Express server)
        changeOrigin: true,
        secure: false
      }
    }
  }
});
