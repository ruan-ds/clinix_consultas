import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import NavbarGeneral from '../../components-doctor/general/navbar/navbargeneral';
import SidebarClinix from '../../components-clinix/feed/sidebar/sidebar';
import ContentClinix from '../../components-clinix/feed/content/content';
import './clinix-feed.css';

const ROUTE_TO_TELA: Record<string, number> = {
  '/clinix':          0,
  '/clinix/clinicas': 1,
  '/clinix/acesso':   2,
  '/clinix/config':   3,
};

function ClinixFeed() {
  const location = useLocation();
  const [telaAtiva, setTelaAtiva] = useState(ROUTE_TO_TELA[location.pathname] ?? 0);
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    const tela = ROUTE_TO_TELA[location.pathname];
    if (tela !== undefined) setTelaAtiva(tela);
  }, [location.pathname]);

  // TODO: trocar pelo validateClinixFeed() quando o backend estiver pronto
  // useEffect(() => {
  //   validateClinixFeed().then((data) => setAdminName(data.admin.person_name));
  // }, []);

  return (
    <div className="feed-wrapper">
      <NavbarGeneral />
      <div className="page-container">
        <SidebarClinix telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
        <main className="main-content">
          <ContentClinix
            telaAtiva={telaAtiva}
            setTelaAtiva={setTelaAtiva}
            adminName={adminName}
          />
        </main>
      </div>
    </div>
  );
}

export default ClinixFeed;