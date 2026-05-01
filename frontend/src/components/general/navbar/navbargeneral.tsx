import React from 'react';
import './navbargeneral.css';
import logo from '../../../assets/images/logo.png';
import { FiUser } from "react-icons/fi";
function NavbarGeneral() {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="logo Clinix" />
      </div>
      <div className="nav-links">
        <a href="#">Minhas Consultas</a>
        <a href="#">Histórico</a>
      </div>
      <div className="nav-profile">
        <div className="profile-icon"><FiUser /></div>
      </div>
    </nav>
  );
}

export default NavbarGeneral;