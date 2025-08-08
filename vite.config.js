import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'emoji-mart/css/emoji-mart.css': 'emoji-mart/dist/emoji-mart.css' // Fixes emoji-mart CSS
    }
  },
  server: {
    proxy: {
      '/api': { // Fixes CORS for API requests
        target: 'https://socialvibebackend-5.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false
      }
    }
  }
});