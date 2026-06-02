import React, { useState, useEffect } from 'react';
import NavbarGeneral from '../../components/general/navbar/navbargeneral';
import Sidebar from '../../components/feed/sidebar/sidebar';
import Content from '../../components/feed/content/content';
import { validateFeed, FeedValidation } from '../../services/patientService';
import { removeToken } from '../../services/tokenService';
import './feed.css';

function Feed() {
  const [telaAtiva, setTelaAtiva] = useState(0);
  const [feedData, setFeedData] = useState<FeedValidation | null>(null);

  useEffect(() => {
    validateFeed()
      .then((data) => setFeedData(data))
      .catch(() => {
        removeToken();
        window.location.href = "/authenticantion.html";
      });
  }, []);

  if (!feedData) return null; // aguarda validação antes de renderizar

  return (
    <div className="feed-wrapper">
      <NavbarGeneral telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
      <div className="page-container">
        <Sidebar telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
        <main className="main-content">
          <Content
            telaAtiva={telaAtiva}
            setTelaAtiva={setTelaAtiva}
            userName={feedData.patient.person_name}
          />
        </main>
      </div>
    </div>
  );
}

export default Feed;