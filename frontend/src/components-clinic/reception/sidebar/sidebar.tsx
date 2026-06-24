import React from 'react';
import './sidebar.css';
import { FiHome, FiUserPlus, FiCalendar } from 'react-icons/fi';

interface SidebarProps {
  telaAtiva: number;
  setTelaAtiva: (id: number) => void;
}

function Sidebar({ telaAtiva, setTelaAtiva }: SidebarProps) {
  return (
    <aside className="sidebar">
      <nav className="menu">
        <div
          className={`menu-item ${telaAtiva === 0 ? 'active' : ''}`}
          onClick={() => setTelaAtiva(0)}
          style={{ cursor: 'pointer' }}
        >
          <FiHome className="icon" /> <span>Fluxo do Dia</span>
        </div>

        <div
          className={`menu-item ${telaAtiva === 1 ? 'active' : ''}`}
          onClick={() => setTelaAtiva(1)}
          style={{ cursor: 'pointer' }}
        >
          <FiUserPlus className="icon" /> <span>Cadastro Rápido</span>
        </div>

        <div
          className={`menu-item ${telaAtiva === 2 ? 'active' : ''}`}
          onClick={() => setTelaAtiva(2)}
          style={{ cursor: 'pointer' }}
        >
          <FiCalendar className="icon" /> <span>Agendamento</span>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
