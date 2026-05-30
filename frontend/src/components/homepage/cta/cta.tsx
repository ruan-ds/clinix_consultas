import React from 'react';
import './cta.css';

function Cta() {
  return (
    <section className="cta-section">
      <h2 className="section-title">O que é o CLINIX?</h2>
      <div className="cta-banner">
        <div className="background-shape"></div>
        <section className="about-clinix-section">
          <div className="about-container">
            <div className="about-content">
              <h3 className="about-subtitle">
                A conexão inteligente entre sua clínica e novos pacientes.
              </h3>

              <p className="about-description">
                O CLINIX é uma plataforma digital que conecta pacientes à sua agenda de
                forma rápida e sem complicação.
              </p>

              <h4 className="about-list-title">Por que escolher o CLINIX?</h4>

              <ul className="about-list">
                <li>
                  <i className="fa-solid fa-eye"></i>
                  <div>
                    <strong>Mais Visibilidade:</strong> Sua clínica em destaque para
                    quem busca atendimento.
                  </div>
                </li>

                <li>
                  <i className="fa-regular fa-calendar-check"></i>
                  <div>
                    <strong>Mais Consultas:</strong> Agendamentos confirmados e menos
                    faltas.
                  </div>
                </li>

                <li>
                  <i className="fa-solid fa-laptop-medical"></i>
                  <div>
                    <strong>Gestão Simples:</strong> Menos burocracia e mais foco no
                    paciente.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className="cta-content">
          <div className="cta-text">
            <h3>Sua Clínica ainda não usa a CLINIX?</h3>
            <p>Aumente o fluxo de pacientes, reduza custos e modernize sua gestão.</p>
          </div>
          <a href="#" className="btn-cta">
            Quero levar a CLINIX à minha Clínica
          </a>
        </div>
      </div>
    </section>
  );
}

export default Cta;
