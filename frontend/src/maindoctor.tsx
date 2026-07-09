import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DoctorFeed from './pages/doctor/DoctorFeed';

/**
 * Roteamento para a área do médico.
 *
 * Em produção, este bundle é servido no subdomínio  medico.clinix.com
 * (ou doctor.clinix.com). O servidor (nginx/caddy/etc.) aponta esse
 * subdomínio para este arquivo HTML.
 *
 * Rotas disponíveis:
 *   /           → Dashboard (Agenda de hoje)   telaAtiva = 0
 *   /pacientes  → Meus Pacientes               telaAtiva = 1
 *   /prescricoes → Prescrições                 telaAtiva = 2
 *
 * Nota: a troca de tela via sidebar ainda usa estado interno (telaAtiva)
 * para não exigir reload. As rotas são apenas deep-link / bookmark.
 * Quando o back-end estiver pronto, adicione autenticação aqui (guard route).
 */
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
