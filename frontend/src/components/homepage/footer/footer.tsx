import React from 'react';
import './footer.css';

function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div className="footer-logo-col">
          <img src="../src/assets/images/logo.png" alt="Logo Clinix" />
        </div>
        <div className="footer-col">
          <h4>Contatos</h4>
          <p>Tel: (31) 91234-5678</p>
          <p>E-mail: clinix@gmail.com</p>
        </div>
        <div className="footer-col">
          <h4>Links</h4>
          <p>Links Úteis:</p>
          <a href="#">Termos e Condições,</a>
          <a href="#">Política de Privacidade</a>
        </div>
        <div className="footer-col">
          <h4>Horário</h4>
          <p>Horário comercial:</p>
          <p>8h às 18h</p>
        </div>
        <div className="footer-col">
          <h4>Funcionamento</h4>
          <p>Segunda a Sexta</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
