import React, { useState, useEffect } from 'react';
import NavbarGeneral from '../../components/general/navbar/navbargeneral';
import Sidebar from '../../components-clinic/reception/sidebar/sidebar';
import Content from '../../components-clinic/reception/content/content';
import { removeToken } from '../../services/tokenService';
import { validateReception, type ReceptionValidation } from '../../services/receptionService';
import './reception.css';

// TODO: quando o endpoint de validação da recepção estiver pronto no backend
// (validateReception em receptionService.ts), o mock abaixo já está comentado
// e a chamada real está pronta logo abaixo. Basta remover o mock e descomentar.

function Reception() {
  const [telaAtiva, setTelaAtiva] = useState(0);
  const [feedData, setFeedData] = useState<ReceptionValidation | null>(null);

  useEffect(() => {
    // ── Mock temporário enquanto GET /api/reception/validate não existe ──
    const mock: ReceptionValidation = {
      receptionist: {
        id: 0,
        clinical_access_id: 0,
        person_name: 'Recepcionista',
        clinic_name: 'Clínica Demo',
      },
    };
    setFeedData(mock);

    // ── Chamada real (descomentar quando o endpoint existir) ──────────────
    // validateReception()
    //   .then((data) => setFeedData(data))
    //   .catch(() => {
    //     removeToken();
    //     window.location.href = '/authenticantion.html';
    //   });
  }, []);

  if (!feedData) return null;

  return (
    <div className="reception-wrapper">
      <NavbarGeneral telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
      <div className="page-container">
        <Sidebar telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
        <main className="main-content">
          <Content
            telaAtiva={telaAtiva}
            setTelaAtiva={setTelaAtiva}
            receptionistName={feedData.receptionist.person_name}
          />
        </main>
      </div>
    </div>
  );
}

export default Reception;
