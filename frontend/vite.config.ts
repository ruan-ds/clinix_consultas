import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
      input: {
        main:            path.resolve(__dirname, 'index.html'),
        feed:            path.resolve(__dirname, 'feed.html'),
        authenticantion: path.resolve(__dirname, 'authenticantion.html'),
        doctor:          path.resolve(__dirname, 'doctor.html'),
        doctorAuth:      path.resolve(__dirname, 'doctor-auth.html'), // ← novo
        reception:       path.resolve(__dirname, 'reception.html'),  // ← novo
        receptionAuth:   path.resolve(__dirname, 'reception-auth.html'), // ← novo
        clinix:          path.resolve(__dirname, 'clinix.html'), // ← novo
        clinixAuth:      path.resolve(__dirname, 'clinix-auth.html'), // ← novo
        admin:           path.resolve(__dirname, 'admin.html'), // ← novo
        adminAuth:       path.resolve(__dirname, 'admin-auth.html'), // ← novo
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