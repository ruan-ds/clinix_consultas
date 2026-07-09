import React from 'react';
import './navbargeneral.css';
import logo from '../../../assets/images/logo.png';
function NavbarGeneral() {
  return (
            <header className="top-bar">
              <img src={logo} alt="Logo do clinix" />
              <p>CLINIX</p>
            </header>
  );
}

export default NavbarGeneral;