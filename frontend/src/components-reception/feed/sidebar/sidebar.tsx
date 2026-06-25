import React from 'react';
import { useNavigate } from 'react-router-dom';
import './sidebar.css';
import { FiHome, FiCalendar, FiUserPlus } from 'react-icons/fi';

// Mapeamento índice → rota (espelho do ReceptionFeed)
const TELA_TO_ROUTE: Record<number, string> = {
  0: '/recepcao',
  1: '/recepcao/cadastro',
  2: '/recepcao/agendamento',
};

interface SidebarReceptionProps {
  telaAtiva: number;
  setTelaAtiva: (id: number) => void;
}

function SidebarReception({ telaAtiva, setTelaAtiva }: SidebarReceptionProps) {
  const navigate = useNavigate();

  const handleClick = (id: number) => {
    setTelaAtiva(id);
    navigate(TELA_TO_ROUTE[id]);
  };

  return (
    <aside className="sidebar">
      <nav className="menu">
        <div
          className={`menu-item ${telaAtiva === 0 ? 'active' : ''}`}
          onClick={() => handleClick(0)}
          style={{ cursor: 'pointer' }}
        >
          <FiHome className="icon" /> <span>Fluxo do Dia</span>
        </div>

        <div
          className={`menu-item ${telaAtiva === 1 ? 'active' : ''}`}
          onClick={() => handleClick(1)}
          style={{ cursor: 'pointer' }}
        >
          <FiUserPlus className="icon" /> <span>Cadastro Rápido</span>
        </div>

        <div
          className={`menu-item ${telaAtiva === 2 ? 'active' : ''}`}
          onClick={() => handleClick(2)}
          style={{ cursor: 'pointer' }}
        >
          <FiCalendar className="icon" /> <span>Agendamento</span>
        </div>
      </nav>
    </aside>
  );
}

export default SidebarReception;
