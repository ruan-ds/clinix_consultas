import React, { useState } from 'react';
import NavbarGeneral from '../../components/general/navbar/navbargeneral';
import Sidebar from '../../components/feed/sidebar/sidebar';
import Content from '../../components/feed/content/content';
import './feed.css'; 

function Feed() {
  // Estado centralizado das telas:
  // 0 = Dashboard, 1 = Agendar Consulta, 2 = Meus Médicos, 3 = Pagamentos, 4 = Histórico
  const [telaAtiva, setTelaAtiva] = useState(0);

  return (
    <div className="feed-wrapper">
        <NavbarGeneral telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
        
        {/* O container Flexbox engloba APENAS a Sidebar e o Conteúdo */}
        <div className="page-container">
            {/* Passamos o estado e a função para a Sidebar controlar os cliques */}
            <Sidebar telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
            
            <main className="main-content">
                {/* Passamos o estado e a função para o Content escolher o que mostrar */}
                <Content telaAtiva={telaAtiva} setTelaAtiva={setTelaAtiva} />
            </main>
        </div>
    </div>
  );
}

export default Feed;