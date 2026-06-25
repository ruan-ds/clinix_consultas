import React from 'react';
import { useNavigate } from 'react-router-dom';
import './sidebar.css';
import { FiHome, FiUsers } from 'react-icons/fi';
import { BsFileEarmarkText } from 'react-icons/bs';

// Mapeamento índice → rota (espelho do DoctorFeed)
const TELA_TO_ROUTE: Record<number, string> = {
  0: '/',
  1: '/pacientes',
  2: '/prescricoes',
};

interface SidebarProps {
  telaAtiva: number;
  setTelaAtiva: (id: number) => void;
}

function Sidebar({ telaAtiva, setTelaAtiva }: SidebarProps) {
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
          <FiHome className="icon" /> <span>Dashboard</span>
        </div>

        <div
          className={`menu-item ${telaAtiva === 1 ? 'active' : ''}`}
          onClick={() => handleClick(1)}
          style={{ cursor: 'pointer' }}
        >
          <FiUsers className="icon" /> <span>Meus Pacientes</span>
        </div>

        <div
          className={`menu-item ${telaAtiva === 2 ? 'active' : ''}`}
          onClick={() => handleClick(2)}
          style={{ cursor: 'pointer' }}
        >
          <BsFileEarmarkText className="icon" /> <span>Prescrições</span>
        </div>
      </nav>
    </aside>
  );
}

export default Sidebar;
