import React from 'react';
import './navbargeneral.css';
import logo from '../../../assets/images/logo.png';
import { FiUser } from 'react-icons/fi';

interface NavbarReceptionProps {
  telaAtiva: number;
  setTelaAtiva: (id: number) => void;
}

function NavbarReception({ telaAtiva, setTelaAtiva }: NavbarReceptionProps) {
  return (
    <header className="top-bar">
      <img src={logo} alt="Logo do Clinix" />
      <p>CLINIX</p>
      <div className="user-profile" onClick={() => setTelaAtiva(99)}>
        <FiUser />
      </div>
    </header>
  );
}

export default NavbarReception;
