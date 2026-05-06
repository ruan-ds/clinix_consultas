import React from 'react';
import './navbargeneral.css';
import logo from '../../../assets/images/logo.png';
import { FiUser } from "react-icons/fi";

function NavbarGeneral() {
  return (
            <header className="top-bar">
              <img src={logo} alt="Logo do clinix" />
              <p>CLINIX</p>
                <div className="user-profile">
                   <FiUser />
                </div>
            </header>
  );
}

export default NavbarGeneral;