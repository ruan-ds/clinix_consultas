import React from 'react';
import './navbar.css';
import logo from '../../../assets/images/logo.png';
function Navbar() {
  return (
    <nav>
      <img src={logo} alt="logo clinix" />
      <p>CLINIX</p>
      <div className="buttonnav">
        <a href="/login.html" id="bt1nv">
          Entrar
        </a>
        <a href="/register.html" id="bt2nv">
          Registrar
        </a>
      </div>
    </nav>
  );
}

export default Navbar;
