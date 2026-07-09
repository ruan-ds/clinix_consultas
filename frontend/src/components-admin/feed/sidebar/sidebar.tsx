import React from 'react';
import './sidebar.css';
import { FiHome, FiSettings } from 'react-icons/fi';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { HiOutlineClipboardList } from 'react-icons/hi';

interface SidebarAdminProps {
  telaAtiva: number;
  setTelaAtiva: (id: number) => void;
}

function SidebarAdmin({ telaAtiva, setTelaAtiva }: SidebarAdminProps) {
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
          <HiOutlineClipboardList className="icon" /> <span>Gestão de Serviços e Especialidades</span>
        </div>

        <div
          className={`menu-item ${telaAtiva === 2 ? 'active' : ''}`}
          onClick={() => setTelaAtiva(2)}
          style={{ cursor: 'pointer' }}
        >
          <MdOutlineManageAccounts className="icon" /> <span>Gestão de Funcionários</span>
        </div>

        <div
          className={`menu-item ${telaAtiva === 3 ? 'active' : ''}`}
          onClick={() => setTelaAtiva(3)}
          style={{ cursor: 'pointer' }}
        >
          <FiSettings className="icon" /> <span>Config. Agenda</span>
        </div>
      </nav>
    </aside>
  );
}

export default SidebarAdmin;
