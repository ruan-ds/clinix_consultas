import { defineConfig, type Connect } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Mapa de subdomínios locais -> páginas da aplicação.
 *
 * Em produção cada uma dessas áreas é servida em seu próprio subdomínio
 * (ex: doctor.clinix.com, admin.clinix.com, etc). Este plugin reproduz
 * o mesmo comportamento em desenvolvimento usando *.localhost, que os
 * navegadores modernos já resolvem para 127.0.0.1 automaticamente
 * (RFC 6761) — não é necessário editar o arquivo hosts na maioria dos
 * sistemas.
 *
 * Acesse, por exemplo:
 *   http://doctor.localhost:5173/        -> doctor.html      (protegido)
 *   http://doctor.localhost:5173/auth    -> doctor-auth.html  (login)
 *
 * Home ("/"), a autenticação genérica ("/authenticantion.html") e o
 * feed ("/feed.html") continuam apenas no domínio principal
 * (http://localhost:5173), sem subdomínio.
 */
const SUBDOMAINS: Record<string, { root: string; auth: string }> = {
  doctor:    { root: '/doctor.html',    auth: '/doctor-auth.html' },
  admin:     { root: '/admin.html',     auth: '/admin-auth.html' },
  reception: { root: '/reception.html', auth: '/reception-auth.html' },
  clinix:    { root: '/clinix.html',    auth: '/clinix-auth.html' },
};

// Prefixos de caminho que NUNCA devem ser reescritos (assets, HMR, módulos etc.)
const PASSTHROUGH_PREFIXES = ['/src/', '/@', '/node_modules/', '/assets/'];

function isStaticAssetPath(url: string): boolean {
  if (PASSTHROUGH_PREFIXES.some((p) => url.startsWith(p))) return true;
  // Qualquer caminho com extensão de arquivo (.js, .css, .png, .ico, etc.)
  // é tratado como asset e passa direto.
  return /\.[a-zA-Z0-9]+$/.test(url.split('?')[0]);
}

function subdomainRouter() {
  return {
    name: 'clinix-subdomain-router',
    configureServer(server: { middlewares: { use: (fn: Connect.NextHandleFunction) => void } }) {
      server.middlewares.use((req, _res, next) => {
        const hostHeader = req.headers.host ?? '';
        const hostname = hostHeader.split(':')[0];

        // Só atua em subdomínios de *.localhost (ex: doctor.localhost)
        if (!hostname.endsWith('.localhost')) return next();

        const sub = hostname.slice(0, -'.localhost'.length);
        const cfg = SUBDOMAINS[sub];
        if (!cfg) return next();

        const url = req.url ?? '/';
        const pathOnly = url.split('?')[0];

        if (isStaticAssetPath(pathOnly)) {
          return next(); // deixa vite servir js/css/imagens normalmente
        }

        if (pathOnly === '/auth' || pathOnly === '/auth/') {
          req.url = cfg.auth;
        } else {
          // Qualquer outra rota (/, /pacientes, /prescricoes, etc.) cai
          // no "index" daquela área — fallback estilo SPA. A própria
          // área decide (via roleGuard) se manda o usuário pro /auth.
          req.url = cfg.root;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), subdomainRouter()],

  server: {
    port: 5173,
    // Permite Host headers de qualquer subdomínio *.localhost, além do
    // localhost puro (proteção contra DNS rebinding do Vite).
    allowedHosts: ['.localhost', 'localhost'],
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
        clinixAuth:      path.resolve(__dirname, 'clinix-auth.html'),
        admin:           path.resolve(__dirname, 'admin.html'),
        adminAuth:       path.resolve(__dirname, 'admin-auth.html'),
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
