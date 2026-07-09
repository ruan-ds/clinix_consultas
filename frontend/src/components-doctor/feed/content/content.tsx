import React from 'react';
import Dashboard from './dashboard/dashboard';
import Patients from './patients/patients';
import Prescriptions from './prescriptions/prescriptions';
import EmitirPrescricao from './prescriptionsIssue/prescriptionsissue';

interface ContentProps {
  telaAtiva: number;
  setTelaAtiva: (id: number) => void;
  userName: string;
  userSpecialty?: string;
}

function Content({ telaAtiva, setTelaAtiva, userName, userSpecialty }: ContentProps) {
  return (
    <div className="content-container">
      {(() => {
        switch (telaAtiva) {
          case 0:
            return <Dashboard userName={userName} userSpecialty={userSpecialty} />;
          case 1:
            return <Patients />;
          case 2:
            return <Prescriptions setTelaAtiva={setTelaAtiva} />;
          case 3:
            return <EmitirPrescricao setTelaAtiva={setTelaAtiva} />;
          default:
            return <Dashboard userName={userName} userSpecialty={userSpecialty} />;
        }
      })()}
    </div>
  );
}

export default Content;
