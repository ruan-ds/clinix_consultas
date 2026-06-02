import React from 'react';
import Dashboard from './dashboard/dashboard';
import HistoryComplete from './history/historyComplete';
import Appointment from './appointment/appointment';
import Doctors from './doctors/doctors';
import Configs from './configs/configs';

interface ContentProps {
    telaAtiva: number;
    setTelaAtiva: (id: number) => void;
    userName: string; // ← adiciona
}

function Content({ telaAtiva, setTelaAtiva, userName }: ContentProps) {
    
    return (
        <div className="content-container">
            {(() => {
                switch (telaAtiva) {
                    case 0:
                        return <Dashboard onVerHistorico={() => setTelaAtiva(3)} onAgendar={() => setTelaAtiva(1)} userName={userName} />; // ← repassa
                    case 1:
                        return <Appointment/>
                    case 2:
                        return <Doctors/>
                    case 3:
                        return <HistoryComplete/>
                    case 4:
                        return <Configs userName={userName} />
                    default:
                        return <Dashboard onVerHistorico={() => setTelaAtiva(0)} onAgendar={() => setTelaAtiva(1)} userName={userName} />;
                }
            })()}
        </div>
    );
}

export default Content;