import React from 'react';
import './sidebar.css';
import { FiHome, FiSettings } from 'react-icons/fi';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { MdOutlineManageAccounts } from 'react-icons/md';

interface SidebarClinixProps {
  telaAtiva: number;
  setTelaAtiva: (id: number) => void;
}

function SidebarClinix({ telaAtiva, setTelaAtiva }: SidebarClinixProps) {
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
          <HiOutlineBuildingOffice2 className="icon" /> <span>Gestão de Clínicas</span>
        </div>

        <div
          className={`menu-item ${telaAtiva === 2 ? 'active' : ''}`}
          onClick={() => setTelaAtiva(2)}
          style={{ cursor: 'pointer' }}
        >
          <MdOutlineManageAccounts className="icon" /> <span>Gestão de Acesso</span>
        </div>

        <div
          className={`menu-item ${telaAtiva === 3 ? 'active' : ''}`}
          onClick={() => setTelaAtiva(3)}
          style={{ cursor: 'pointer' }}
        >
          <FiSettings className="icon" /> <span>Config. Master</span>
        </div>
      </nav>
    </aside>
  );
}

export default SidebarClinix;
