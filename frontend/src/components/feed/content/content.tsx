import React from 'react';
import Dashboard from './dashboard/dashboard';
import HistoryComplete from './history/historyComplete';

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
                        return <Dashboard onVerHistorico={() => setTelaAtiva(4)} />;
                    case 1:
                        return <div><h2>Agendar Consulta</h2><p>(Página em construção)</p></div>;
                    case 2:
                        return <div><h2>Meus Médicos</h2><p>(Página em construção)</p></div>;
                    case 3:
                        return <div><h2>Pagamentos</h2><p>(Página em construção)</p></div>;
                    case 4:
                        // Histórico Completo. Se clicar na setinha de voltar, retorna para a tela 0
                        return <HistoryComplete onVoltar={() => setTelaAtiva(0)} />;
                    default:
                        // Por segurança, se der algum número errado, mostra sempre o Dashboard
                        return <Dashboard onVerHistorico={() => setTelaAtiva(4)} />;
                }
            })()}
        </div>
    );
}

export default Content;