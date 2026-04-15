import React from 'react';
import './navbar.css';
import logo from '../../../assets/images/logo.png';
function Navbar() {
  return (
    <nav>
      <img src={logo} alt="logo clinix" />
      <p>CLINIX</p>
      <div className="buttonnav">
        <a href="authenticantion.html?tela=1" id="bt1nv">
          Entrar
        </a>
        <a href="authenticantion.html?tela=0" id="bt2nv">
          Registrar
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
