import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavbarGeneral from '../../components-doctor/general/navbar/navbargeneral';
import Sidebar from '../../components-doctor/feed/sidebar/sidebar';
import Content from '../../components-doctor/feed/content/content';
import './doctor-feed.css';

// Mapeamento rota → índice da tela
const ROUTE_TO_TELA: Record<string, number> = {
  '/':            0,
  '/pacientes':   1,
  '/prescricoes': 2,
};

const MOCK_DOCTOR_NAME = 'Silva';

function DoctorFeed() {
  const location = useLocation();

  // Inicializa telaAtiva com base na URL atual (suporta deep-link e reload)
  const [telaAtiva, setTelaAtiva] = useState(
    ROUTE_TO_TELA[location.pathname] ?? 0
  );

  // Sincroniza se o usuário navegar via botão Voltar/Avançar do browser
  useEffect(() => {
    const tela = ROUTE_TO_TELA[location.pathname];
    if (tela !== undefined) setTelaAtiva(tela);
  }, [location.pathname]);

  return (
    <div className="feed-wrapper">
      <NavbarGeneral />
      <div className="page-container">
        <Sidebar telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
        <main className="main-content">
          <Content
            telaAtiva={telaAtiva}
            setTelaAtiva={setTelaAtiva}
            userName={MOCK_DOCTOR_NAME}
          />
        </main>
      </div>
    </div>
  );
}

export default DoctorFeed;
