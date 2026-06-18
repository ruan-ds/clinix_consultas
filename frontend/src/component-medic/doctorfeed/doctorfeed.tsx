import React, { useState } from 'react';
import { DoctorDashboard } from '../dashboard-medic/doctordashboard';
// Importe suas outras telas aqui no futuro:
// import { MeusPacientes } from './MeusPacientes';
// import { Prescricoes } from './Prescricoes';

import './doctor-feed.css';

export const DoctorFeed = () => {
  // Estado que controla qual tela está ativa no momento
  const [telaAtiva, setTelaAtiva] = useState<'dashboard' | 'pacientes' | 'prescricoes'>('dashboard');

  return (
    <div className="df-layout-container">
      
      {/* ==========================================
          NAVBAR SUPERIOR FIXA
          ========================================== */}
      <nav className="df-navbar">
        <div className="df-nav-logo">
          {/* Substitua pela tag img do seu logo real do Clinix */}
          <h2>CLINIX</h2> 
        </div>
        <div className="df-nav-profile">
          <div className="df-profile-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      </nav>

      <div className="df-body">
        {/* ==========================================
            SIDEBAR (BARRA LATERAL FIXA)
            ========================================== */}
        <aside className="df-sidebar">
          <ul className="df-menu-list">
            
            <li 
              className={`df-menu-item ${telaAtiva === 'dashboard' ? 'active' : ''}`}
              onClick={() => setTelaAtiva('dashboard')}
            >
              <span className="df-menu-icon">🏠</span> {/* Troque pelos seus ícones reais */}
              Dashboard
            </li>

            <li 
              className={`df-menu-item ${telaAtiva === 'pacientes' ? 'active' : ''}`}
              onClick={() => setTelaAtiva('pacientes')}
            >
              <span className="df-menu-icon">👥</span>
              Meus Pacientes
            </li>

            <li 
              className={`df-menu-item ${telaAtiva === 'prescricoes' ? 'active' : ''}`}
              onClick={() => setTelaAtiva('prescricoes')}
            >
              <span className="df-menu-icon">📝</span>
              Prescrições
            </li>

          </ul>
        </aside>

        {/* ==========================================
            CONTEÚDO DINÂMICO (MIOLO DA PÁGINA)
            ========================================== */}
        <main className="df-main-content">
          {telaAtiva === 'dashboard' && <DoctorDashboard />}
          
          {/* Quando você criar as outras telas, basta descomentar: */}
          {/* {telaAtiva === 'pacientes' && <MeusPacientes />} */}
          {/* {telaAtiva === 'prescricoes' && <Prescricoes />} */}
        </main>
      </div>

    </div>
  );
};