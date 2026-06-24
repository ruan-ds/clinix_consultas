import React from 'react';
import DailyFlow from './dailyFlow/dailyFlow';
import QuickRegistration from './quickRegistration/quickRegistration';
import Scheduling from './scheduling/scheduling';
import './content.css';

interface ContentReceptionProps {
  telaAtiva: number;
  setTelaAtiva: (id: number) => void;
  receptionistName: string;
}

function ContentReception({ telaAtiva, setTelaAtiva, receptionistName }: ContentReceptionProps) {
  return (
    <div className="content-container">
      {(() => {
        switch (telaAtiva) {
          case 0:
            return <DailyFlow />;
          case 1:
            return <QuickRegistration />;
          case 2:
            return <Scheduling />;
          default:
            return <DailyFlow />;
        }
      })()}
    </div>
  );
}

export default ContentReception;
