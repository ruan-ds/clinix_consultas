import React from 'react';
import './sidebar.css';
import { FiHome, FiCalendar, FiUsers, FiCreditCard, FiSettings } from "react-icons/fi";

function Sidebar() {
  return (
    <aside className="sidebar">
      <nav className="menu">
        <a href="#" className="menu-item active">
          <FiHome className="icon" /> <span>Dashboard</span>
        </a>
        <a href="#" className="menu-item">
          <FiCalendar className="icon" /> <span>Agendar Consulta</span>
        </a>
        <a href="#" className="menu-item">
          <FiUsers className="icon" /> <span>Meus Médicos</span>
        </a>
        <a href="#" className="menu-item">
          <FiCreditCard className="icon" /> <span>Pagamentos</span>
        </a>
        <a href="#" className="menu-item">
          <FiSettings className="icon" /> <span>Configurações</span>
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;