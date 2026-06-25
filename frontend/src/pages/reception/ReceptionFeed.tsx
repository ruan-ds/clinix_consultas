import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavbarGeneral from '../../components-doctor/general/navbar/navbargeneral';
import SidebarReception from '../../components-reception/feed/sidebar/sidebar';
import ContentReception from '../../components-reception/feed/content/content';
import type { ReceptionFeedValidation } from '../../services/receptionService';
import './reception-feed.css';

const ROUTE_TO_TELA: Record<string, number> = {
  '/recepcao':             0,
  '/recepcao/cadastro':    1,
  '/recepcao/agendamento': 2,
};

function ReceptionFeed() {
  const location = useLocation();
  const [telaAtiva, setTelaAtiva] = useState(ROUTE_TO_TELA[location.pathname] ?? 0);
  const [feedData, setFeedData] = useState<ReceptionFeedValidation | null>(null);

  useEffect(() => {
    const tela = ROUTE_TO_TELA[location.pathname];
    if (tela !== undefined) setTelaAtiva(tela);
  }, [location.pathname]);

  useEffect(() => {
    // TODO: trocar pelo validateReceptionFeed() quando o backend estiver pronto
    setFeedData({
  receptionist: {
    id: 0,
    person_name: 'Recepcionista',
  },
} as ReceptionFeedValidation);
  }, []);

  if (!feedData) return null;

  return (
    <div className="feed-wrapper">
      <NavbarGeneral />
      <div className="page-container">
        <SidebarReception telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
        <main className="main-content">
          <ContentReception
            telaAtiva={telaAtiva}
            setTelaAtiva={setTelaAtiva}
            receptionistName={feedData.receptionist.person_name}
          />
        </main>
      </div>
    </div>
  );
}

export default ReceptionFeed;