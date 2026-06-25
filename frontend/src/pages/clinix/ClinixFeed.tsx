import React, { useEffect, useState } from 'react';
import NavbarGeneral from '../../components-doctor/general/navbar/navbargeneral';
import SidebarClinix from '../../components-clinix/feed/sidebar/sidebar';
import ContentClinix from '../../components-clinix/feed/content/content';
import { validateClinixFeed } from '../../services/clinixService';
import './clinix-feed.css';

function ClinixFeed() {
  const [telaAtiva, setTelaAtiva] = useState(0);
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    // TODO: validar sessão/permissão do administrador junto ao backend real.
    validateClinixFeed().then((data) => setAdminName(data.admin.person_name));
  }, []);

  return (
    <div className="feed-wrapper">
      <NavbarGeneral/>
      <div className="page-container">
        <SidebarClinix telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
        <main className="main-content">
          <ContentClinix telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} adminName={adminName} />
        </main>
      </div>
    </div>
  );
}

export default ClinixFeed;
