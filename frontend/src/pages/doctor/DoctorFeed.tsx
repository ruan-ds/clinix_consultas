import React, { useState } from 'react';
import NavbarGeneral from '../../components-doctor/general/navbar/navbargeneral';
import Sidebar from '../../components-doctor/feed/sidebar/sidebar';
import Content from '../../components-doctor/feed/content/content';
import './doctor-feed.css';

// Nome do médico vem do token/API futuramente.
// Por ora usamos mock diretamente na página.
const MOCK_DOCTOR_NAME = 'Silva';

function DoctorFeed() {
  const [telaAtiva, setTelaAtiva] = useState(0);

  return (
    <div className="feed-wrapper">
      <NavbarGeneral/>
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
