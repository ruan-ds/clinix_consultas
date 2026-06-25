import React from 'react';
import { useNavigate } from 'react-router-dom';
import './sidebar.css';
import { FiHome, FiSettings } from 'react-icons/fi';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { MdOutlineManageAccounts } from 'react-icons/md';

// Mapeamento índice → rota (espelho do ClinixFeed)
const TELA_TO_ROUTE: Record<number, string> = {
  0: '/clinix',
  1: '/clinix/clinicas',
  2: '/clinix/acesso',
  3: '/clinix/config',
};

interface SidebarClinixProps {
  telaAtiva: number;
  setTelaAtiva: (id: number) => void;
}

function SidebarClinix({ telaAtiva, setTelaAtiva }: SidebarClinixProps) {
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
          <HiOutlineBuildingOffice2 className="icon" /> <span>Gestão de Clínicas</span>
        </div>

        <div
          className={`menu-item ${telaAtiva === 2 ? 'active' : ''}`}
          onClick={() => handleClick(2)}
          style={{ cursor: 'pointer' }}
        >
          <MdOutlineManageAccounts className="icon" /> <span>Gestão de Acesso</span>
        </div>

        <div
          className={`menu-item ${telaAtiva === 3 ? 'active' : ''}`}
          onClick={() => handleClick(3)}
          style={{ cursor: 'pointer' }}
        >
          <FiSettings className="icon" /> <span>Config. Master</span>
        </div>
      </nav>
    </aside>
  );
}

export default SidebarClinix;
