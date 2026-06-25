import React, { useState, useEffect } from 'react';
import NavbarGeneral from '../../components-doctor/general/navbar/navbargeneral';
import SidebarReception from '../../components-reception/feed/sidebar/sidebar';
import ContentReception from '../../components-reception/feed/content/content';
import { validateReceptionFeed, type ReceptionFeedValidation } from '../../services/receptionService';
import { removeToken } from '../../services/tokenService';
import './reception-feed.css';

function ReceptionFeed() {
  const [telaAtiva, setTelaAtiva] = useState(0);
  const [feedData, setFeedData] = useState<ReceptionFeedValidation | null>(null);

  useEffect(() => {
    validateReceptionFeed()
      .then((data) => setFeedData(data))
      .catch(() => {
        removeToken();
        window.location.href = '/authenticantion.html';
      });
  }, []);

  if (!feedData) return null;

  return (
    <div className="feed-wrapper">
      <NavbarGeneral/>
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
