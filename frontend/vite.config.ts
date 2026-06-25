import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    {
  name: 'clinica-host-redirect',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const host = req.headers.host ?? '';
      if (host.startsWith('clinica.')) {
        // Redireciona QUALQUER rota do clinica.localhost para clinica.html
        // exceto assets (/src/, /@, /node_modules/) que o Vite precisa servir normalmente
        const isAsset = req.url?.startsWith('/src/')
          || req.url?.startsWith('/@')
          || req.url?.startsWith('/node_modules/')
          || req.url?.includes('.');

        if (!isAsset) {
          req.url = '/clinica.html';
        }
      }
      next();
    });
  },
},
  ],

  server: {
    allowedHosts: ['clinica.localhost'],
  },

  build: {
    rollupOptions: {
      input: {
        main:            path.resolve(__dirname, 'index.html'),
        feed:            path.resolve(__dirname, 'feed.html'),
        authenticantion: path.resolve(__dirname, 'authenticantion.html'),
        doctor:          path.resolve(__dirname, 'doctor.html'),
        doctorAuth:      path.resolve(__dirname, 'doctor-auth.html'),
        reception:       path.resolve(__dirname, 'reception.html'),
        receptionAuth:   path.resolve(__dirname, 'reception-auth.html'),
        clinix:          path.resolve(__dirname, 'clinix.html'),
        clinica:         path.resolve(__dirname, 'clinica.html'),
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