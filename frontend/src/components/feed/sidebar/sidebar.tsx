import React from 'react';
import './sidebar.css';
import { FiHome, FiCalendar, FiUsers, FiCreditCard, FiSettings } from "react-icons/fi";
import { LuClock11 } from "react-icons/lu";
import { BsCalendarCheck } from 'react-icons/bs';

// Definimos o que a Sidebar vai receber do Feed
interface SidebarProps {
    telaAtiva: number;
    setTelaAtiva: (id: number) => void;
}

function Sidebar({ telaAtiva, setTelaAtiva }: SidebarProps) {
  return (
    <aside className="sidebar">
      <nav className="menu">
        {/* Se a telaAtiva for 0, adiciona a classe "active" */}
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
          <FiCalendar className="icon" /> <span>Agendar Consulta</span>
        </div>

        <div
          className={`menu-item ${telaAtiva === 5 ? 'active' : ''}`}
          onClick={() => setTelaAtiva(5)}
          style={{ cursor: 'pointer' }}
        >
          <BsCalendarCheck className="icon" /> <span>Consultas Ativas</span>
        </div>
        
        <div 
          className={`menu-item ${telaAtiva === 2 ? 'active' : ''}`} 
          onClick={() => setTelaAtiva(2)}
          style={{ cursor: 'pointer' }}
        >
          <FiUsers className="icon" /> <span>Meus Médicos</span>
        </div>

        <div 
          className={`menu-item ${telaAtiva === 3 ? 'active' : ''}`} 
          onClick={() => setTelaAtiva(3)}
          style={{ cursor: 'pointer' }}
        >
          <LuClock11  className="icon" /> <span>Histórico</span>
        </div>

      </nav>
    </aside>
  );
}

export default Sidebar;