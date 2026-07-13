import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DoctorFeed from './pages/doctor/DoctorFeed';
import { requireAccess } from './services/roleGuard';

/**
 * Roteamento para a área do médico.
 *
 * Em produção, este bundle é servido no subdomínio  medico.clinix.com
 * (ou doctor.clinix.com). Em dev local, use http://doctor.localhost:5173.
 *
 * Barreira de acesso (mock, sem back-end ainda): só renderiza se o
 * usuário tiver passado pelo login de doctor-auth.html nesta sessão.
 * Acesso direto é redirecionado para /auth (doctor.localhost/auth).
 */
const podeAcessar = requireAccess('doctor', '/auth');

if (podeAcessar) {
  ReactDOM.createRoot(document.getElementById('root-doctor')!).render(
    <React.StrictMode>
      <BrowserRouter>
        <Routes>
          {/* Rota principal — renderiza DoctorFeed em qualquer sub-rota */}
          <Route path="/*" element={<DoctorFeed />} />
          {/* Fallback explícito */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </React.StrictMode>,
  );
}
