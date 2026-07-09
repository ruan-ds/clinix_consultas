import React, { useState } from 'react';
import NavbarGeneral from '../../components-doctor/general/navbar/navbargeneral';
import Sidebar from '../../components-doctor/feed/sidebar/sidebar';
import Content from '../../components-doctor/feed/content/content';
import './doctor-feed.css';

// Nome e especialidade do médico vêm do token/API futuramente.
// Por ora usamos mock diretamente na página.
// Persona escolhida para esta demonstração: Dra. Juliana Ferreira, Cardiologista.
// Toda a agenda, pacientes e prescrições mockados em doctorService.ts
// seguem esse mesmo recorte de especialidade.
const MOCK_DOCTOR_NAME = 'Juliana Ferreira';
const MOCK_DOCTOR_SPECIALTY = 'Cardiologia';

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
            userSpecialty={MOCK_DOCTOR_SPECIALTY}
          />
        </main>
      </div>
    </div>
  );
}

export default DoctorFeed;
