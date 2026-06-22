import React from 'react';
import './navbargeneral.css';
import logo from '../../../assets/images/logo.png';
import { FiUser } from "react-icons/fi";
interface Propssidebar {
    setTelaAtiva: (id: number) => void;
}
function NavbarGeneral({ setTelaAtiva }: Propssidebar) {
  return (
            <header className="top-bar">
              <img src={logo} alt="Logo do clinix" />
              <p>CLINIX</p>
                <div className="user-profile">
                   <FiUser onClick={() => setTelaAtiva(4)} />
                </div>
            </header>
  );
}

export default NavbarGeneral;