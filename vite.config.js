import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Load env variables based on mode (dev/prod)
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    resolve: {
      alias: {
        'emoji-mart/css/emoji-mart.css': 'emoji-mart/dist/emoji-mart.css'
      }
    },
    server: {
      proxy: mode === 'development' ? {
        '/api': {
          target: env.VITE_API_BASE_URL || 'https://socialvibebackend-5.onrender.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          secure: false
        }
      } : undefined // Disable proxy in production
    },
    define: {
      'process.env': env // Forward env variables to client
    }
  }
});