import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ==========================================
// IMPORTS DO PACIENTE
// ==========================================
import Homepage from './pages/homepage/Homepage';
import Authentication from './pages/auth/authenticantion'; 

// ==========================================
// IMPORTS DA CLÍNICA (MÉDICO & RECEPÇÃO)
// ==========================================
import DoctorFeed from './pages/doctor/DoctorFeed';
// 👇 Adicione o import da tela que criamos para a recepção! 
// (Atenção: confira se o caminho da pasta está certinho com onde você salvou o arquivo)
import DailyFlow from './pages/reception/reception'; 

export const AppRoutes = () => {
  const hostname = window.location.hostname;
  
  // Agora esse isAreaClinica serve para liberar o acesso a TUDO que for interno da clínica
  const isAreaClinica = hostname.startsWith('clinica');

  return (
    <Routes>
      
      {isAreaClinica ? (
        /* =========================================
           MUNDO DA CLÍNICA (Acessado via Subdomínio clinica.*)
           ========================================= */
        <>
          {/* Painel do Médico - Rota padrão ("/") */}
          <Route path="/" element={<DoctorFeed />} />
          
          {/* Painel da Recepção / Fluxo - Nova Rota ("/recepcao") */}
          <Route path="/recepcao" element={<DailyFlow />} />
          
          {/* Se a pessoa digitar um caminho maluco, devolve ela pro Médico */}
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
  );
};

export default AppRoutes;