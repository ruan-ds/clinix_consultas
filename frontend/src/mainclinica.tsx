import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DoctorFeed from './pages/doctor/DoctorFeed';
import ReceptionFeed from './pages/reception/ReceptionFeed';
import ClinixFeed from './pages/clinix/ClinixFeed';
import DoctorLogin from './components-doctor/login/login';
import ReceptionLogin from './components-reception/login/login';
import ClinixLogin from './components-clinix/login/login';

// ─── Wrappers de Auth ────────────────────────────────────────────────────────
// Cada wrapper renderiza o Login da área correspondente.
// O prop changeAuth existe nos Login mas não é usado para navegação aqui —
// a navegação pós-login acontece via window.location.href dentro do sign_in().
function DoctorAuth()    { const [t, setT] = useState(0); return <DoctorLogin    changeAuth={setT} />; }
function ReceptionAuth() { const [t, setT] = useState(0); return <ReceptionLogin changeAuth={setT} />; }
function ClinixAuth()    { const [t, setT] = useState(0); return <ClinixLogin    changeAuth={setT} />; }
// ─────────────────────────────────────────────────────────────────────────────

ReactDOM.createRoot(document.getElementById('root-clinica')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        {/* ── AUTH ───────────────────────────────────────────────────────── */}
        <Route path="/auth"           element={<DoctorAuth />} />
        <Route path="/recepcao/auth"  element={<ReceptionAuth />} />
        <Route path="/clinix/auth"    element={<ClinixAuth />} />

        {/* ── MÉDICO ─────────────────────────────────────────────────────── */}
        <Route path="/"            element={<DoctorFeed />} />
        <Route path="/pacientes"   element={<DoctorFeed />} />
        <Route path="/prescricoes" element={<DoctorFeed />} />

        {/* ── RECEPÇÃO ───────────────────────────────────────────────────── */}
        <Route path="/recepcao"             element={<ReceptionFeed />} />
        <Route path="/recepcao/cadastro"    element={<ReceptionFeed />} />
        <Route path="/recepcao/agendamento" element={<ReceptionFeed />} />

        {/* ── CLINIX ─────────────────────────────────────────────────────── */}
        <Route path="/clinix"          element={<ClinixFeed />} />
        <Route path="/clinix/clinicas" element={<ClinixFeed />} />
        <Route path="/clinix/acesso"   element={<ClinixFeed />} />
        <Route path="/clinix/config"   element={<ClinixFeed />} />

        {/* Fallback → login do médico */}
        <Route path="*" element={<Navigate to="/auth" replace />} />

      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);