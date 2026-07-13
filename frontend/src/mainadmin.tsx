import React from 'react';
import ReactDOM from 'react-dom/client';
import AdminFeed from './pages/admin/AdminFeed';
import { requireAccess } from './services/roleGuard';

// Barreira de acesso (mock): sem login prévio nesta sessão, redireciona
// para /auth (admin.localhost/auth) em vez de renderizar a área.
const podeAcessar = requireAccess('admin', '/auth');

if (podeAcessar) {
  ReactDOM.createRoot(document.getElementById('root-admin')!).render(
    <React.StrictMode>
      <AdminFeed />
    </React.StrictMode>,
  );
}
