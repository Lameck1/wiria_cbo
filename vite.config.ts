import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Base path for GitHub Pages deployment - set to '/' if using custom domain
  base: '/wiria_cbo/',
  plugins: [
    react({
      // Babel options for React 19
      babel: {
        plugins: [],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/shared': resolve(__dirname, './src/shared'),
      '@/features': resolve(__dirname, './src/features'),
      '@/pages': resolve(__dirname, './src/pages'),
      '@/app': resolve(__dirname, './src/app'),
    },
  },
  server: {
    port: 3000,
    open: true,
    allowedHosts: true,
    proxy: {
      // Proxy API requests to backend during development
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query-vendor': ['@tanstack/react-query'],
          'animation-vendor': ['framer-motion'],
        },
      },
    },
  },
});
