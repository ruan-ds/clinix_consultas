import React from 'react';
import ReactDOM from 'react-dom/client';
import ReceptionFeed from './pages/reception/ReceptionFeed';
import { requireAccess } from './services/roleGuard';

// Barreira de acesso (mock): sem login prévio nesta sessão, redireciona
// para /auth (reception.localhost/auth) em vez de renderizar a área.
const podeAcessar = requireAccess('reception', '/auth');

if (podeAcessar) {
  ReactDOM.createRoot(document.getElementById('root-reception')!).render(
    <React.StrictMode>
      <ReceptionFeed />
    </React.StrictMode>,
  );
}
