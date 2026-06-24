import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// ==========================================
// IMPORTS DO PACIENTE
// ==========================================
import Homepage from './pages/homepage/Homepage';
import Authentication from './pages/auth/authenticantion'; 

// ==========================================
// IMPORTS DO MÉDICO
// ==========================================
import DoctorFeed from './pages/doctor/DoctorFeed';

export const AppRoutes = () => {
  // Lê a URL atual (ex: localhost, clinix.com, medico.clinix.com)
  const hostname = window.location.hostname;
  
  // Se a URL começar com "clinica", ele ativa o modo doutor
  const isAreaMedico = hostname.startsWith('clinica');

  return (
    <BrowserRouter>
      <Routes>
        
        {isAreaMedico ? (
          /* =========================================
             MUNDO DO MÉDICO (Acessado via Subdomínio)
             ========================================= */
          <>
            {/* Cai direto no Dashboard sem pedir login */}
            <Route path="/" element={<DoctorFeed />} />
            
            {/* Se digitar qualquer coisa depois da barra, volta pro Dashboard */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        ) : (
          /* =========================================
             MUNDO DO PACIENTE (Acessado via Domínio Normal)
             ========================================= */
          <>
            {/* Homepage padrão */}
            <Route path="/" element={<Homepage />} />
            
            {/* Tela de Login/Cadastro do paciente */}
            <Route path="/auth" element={<Authentication />} />
            
            {/* Qualquer rota perdida volta pra Homepage */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;