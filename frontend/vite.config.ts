import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  // ==========================================
  // O SERVER FICA AQUI FORA!
  // ==========================================
  server: {
    allowedHosts: ['clinica.lvh.me']
  },

  build: {
    rollupOptions: {
      input: {
        main:            path.resolve(__dirname, 'index.html'),
        feed:            path.resolve(__dirname, 'feed.html'),
        authenticantion: path.resolve(__dirname, 'authenticantion.html'),
        doctor:          path.resolve(__dirname, 'doctor.html'),
        doctorAuth:      path.resolve(__dirname, 'doctor-auth.html'), // ← novo
      },
    },
  },

  test: {
    globals: true,
    environment: 'node',
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});