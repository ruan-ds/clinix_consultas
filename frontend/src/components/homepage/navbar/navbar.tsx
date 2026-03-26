import React from 'react'
import './navbar.css'
import logo from "../../../assets/images/logo.png"
function Navbar() {
  return (
        <header>
            <nav>
                <img src={logo} alt="logo clinix" />
                <p>CLINIX</p>
                <div className="buttonnav">
                    <a href="" id="bt1nv">Entrar</a>
                    <a href="" id="bt2nv">Registrar</a>
                </div>
            </nav>
        </header>

  )
}

export default Navbar