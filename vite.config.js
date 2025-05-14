import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  
  console.log('Environment variables:', {
    VITE_SERVER_PORT: env.VITE_SERVER_PORT,
    VITE_SERVER_HOST: env.VITE_SERVER_HOST,
    VITE_BACKEND_PORT: env.VITE_BACKEND_PORT,
    VITE_BACKEND_HOST: env.VITE_BACKEND_HOST
  });

  return {
    plugins: [react()],
    server: {
      port: parseInt(env.VITE_SERVER_PORT) || 3000,
      host: env.VITE_SERVER_HOST || 'localhost',
      open: true
    }
  }
})
