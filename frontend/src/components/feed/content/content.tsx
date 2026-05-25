import React from 'react';
import Dashboard from './dashboard/dashboard';
import HistoryComplete from './history/historyComplete';
import Appointment from './appointment/appointment';
import Doctors from './doctors/doctors';
import Configs from './configs/configs';

// Definimos o que o Content vai receber do Feed
interface ContentProps {
    telaAtiva: number;
    setTelaAtiva: (id: number) => void;
}

function Content({ telaAtiva, setTelaAtiva }: ContentProps) {
    
    return (
        <div className="content-container">
            {/* O switch verifica o número e renderiza apenas o componente correto */}
            {(() => {
                switch (telaAtiva) {
                    case 0:
                        // Dashboard renderizado. Se clicar no botão interno de ver histórico, vira tela 4
                        return <Dashboard onVerHistorico={() => setTelaAtiva(3)} />;
                    case 1:
                        return <Appointment/>
                    case 2:
                        return <Doctors/>
                    case 3:
                        return <HistoryComplete/>
                    case 4:
                        return <Configs/>
                    default:
                        // Por segurança, se der algum número errado, mostra sempre o Dashboard
                        return <Dashboard onVerHistorico={() => setTelaAtiva(0)} />;
                }
            })()}
        </div>
    );
}

export default Content;