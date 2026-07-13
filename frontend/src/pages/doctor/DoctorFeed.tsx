import React, { useState } from 'react';
import NavbarGeneral from '../../components-doctor/general/navbar/navbargeneral';
import Sidebar from '../../components-doctor/feed/sidebar/sidebar';
import Content from '../../components-doctor/feed/content/content';
import './doctor-feed.css';

// Nome, especialidade, CRM e clínica do médico vêm do token/API futuramente.
// Por ora usamos mock diretamente na página.
// Persona escolhida para esta demonstração: Dra. Beatriz Cardoso, Cardiologista,
// a mesma médica criada pelo seed do backend (CRM22222-SP, Clínica Central,
// horário "morning" → 09h-17h). Toda a agenda, pacientes e prescrições
// mockados em doctorService.ts seguem esse mesmo recorte de especialidade.
const MOCK_DOCTOR_NAME = 'Beatriz Cardoso';
const MOCK_DOCTOR_SPECIALTY = 'Cardiologia';
const MOCK_DOCTOR_CRM = 'CRM 22222-SP';
const MOCK_DOCTOR_CLINIC = 'Clínica Central';

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
            userCrm={MOCK_DOCTOR_CRM}
            userClinic={MOCK_DOCTOR_CLINIC}
          />
        </main>
      </div>
    </div>
  );
}

export default DoctorFeed;
