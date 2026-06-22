import React from 'react';
import './sidebar.css';
import { FiHome, FiUsers } from 'react-icons/fi';
import { BsFileEarmarkText } from 'react-icons/bs';

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
          <FiHome className="icon" /> <span>Dashboard</span>
        </div>

        <div
          className={`menu-item ${telaAtiva === 1 ? 'active' : ''}`}
          onClick={() => setTelaAtiva(1)}
          style={{ cursor: 'pointer' }}
        >
          <FiUsers className="icon" /> <span>Meus Pacientes</span>
        </div>

        <div
          className={`menu-item ${telaAtiva === 2 ? 'active' : ''}`}
          onClick={() => setTelaAtiva(2)}
          style={{ cursor: 'pointer' }}
        >
          <BsFileEarmarkText className="icon" /> <span>Prescrições</span>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
