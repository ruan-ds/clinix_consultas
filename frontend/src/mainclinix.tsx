import React from 'react';
import ReactDOM from 'react-dom/client';
import ClinixFeed from './pages/clinix/ClinixFeed';
import { requireAccess } from './services/roleGuard';

// Barreira de acesso (mock): sem login prévio nesta sessão, redireciona
// para /auth (clinix.localhost/auth) em vez de renderizar a área.
const podeAcessar = requireAccess('clinix', '/auth');

if (podeAcessar) {
  ReactDOM.createRoot(document.getElementById('root-clinix')!).render(
    <React.StrictMode>
      <ClinixFeed />
    </React.StrictMode>,
  );
}
