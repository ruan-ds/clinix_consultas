import React from 'react';
import Dashboard from './dashboard/dashboard';
import Patients from './patients/patients';
import Prescriptions from './prescriptions/prescriptions';
interface ContentProps {
  telaAtiva: number;
  setTelaAtiva: (id: number) => void;
  userName: string;
}

function Content({ telaAtiva, setTelaAtiva, userName }: ContentProps) {
  return (
    <div className="content-container">
      {(() => {
        switch (telaAtiva) {
          case 0:
            return <Dashboard userName={userName} />;
          case 1:
            return <Patients />;
          case 2:
            return <Prescriptions />;
          default:
            return <Dashboard userName={userName} />;
        }
      })()}
    </div>
  );
}

export default Content;
