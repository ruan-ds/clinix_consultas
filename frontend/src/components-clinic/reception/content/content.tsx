import React from 'react';
import './content.css';
import DayFlow from './dayflow/dayflow';
import QuickRegister from './quickregister/quickregister';
import Appointment from './appointment/appointment';

interface ContentProps {
  telaAtiva: number;
  setTelaAtiva: (id: number) => void;
  receptionistName: string;
}

function Content({ telaAtiva, setTelaAtiva, receptionistName }: ContentProps) {
  return (
    <div className="content-container">
      {(() => {
        switch (telaAtiva) {
          case 0:
            return (
              <DayFlow
                onAgendar={() => setTelaAtiva(2)}
                onCadastro={() => setTelaAtiva(1)}
              />
            );
          case 1:
            return <QuickRegister />;
          case 2:
            return <Appointment />;
          default:
            return (
              <DayFlow
                onAgendar={() => setTelaAtiva(2)}
                onCadastro={() => setTelaAtiva(1)}
              />
            );
        }
      })()}
    </div>
  );
}

export default Content;
