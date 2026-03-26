import React from 'react'
import './cta.css'

function Cta() {
  return (
        <section className="cta-section">   
          <h2 className="section-title">O que é o CLINIX?</h2>
          <div className="cta-banner">
          <section className="about-clinix-section">
          <div className="about-container">
              
              <div className="about-content">
                  <h3 className="about-subtitle">A ponte inteligente entre a sua clínica e milhares de novos pacientes.</h3>
                  
                  <p className="about-description">
                      O CLINIX é uma plataforma inovadora de agendamento e captação na área da saúde. Nós conectamos pessoas que precisam de atendimento médico imediato diretamente à sua agenda, de forma 100% digital e sem complicação.
                  </p>

                  <h4 className="about-list-title">Por que ter o CLINIX como seu parceiro?</h4>
                  <ul className="about-list">
                      <li>
                          <i className="fa-solid fa-eye"></i>
                          <div>
                              <strong>Visibilidade Constante:</strong> Sua marca em destaque para milhares de usuários que buscam médicos e exames todos os dias.
                          </div>
                      </li>
                      <li>
                          <i className="fa-regular fa-calendar-check"></i>
                          <div>
                              <strong>Mais Agendamentos, Menos Faltas:</strong> Transformamos buscas em consultas reais com confirmações automáticas, reduzindo os horários vagos.
                          </div>
                      </li>
                      <li>
                          <i className="fa-solid fa-laptop-medical"></i>
                          <div>
                              <strong>Gestão Moderna:</strong> Simplificamos o processo de marcação, permitindo que sua recepção foque no atendimento humano e de excelência.
                          </div>
                      </li>
                  </ul>
              </div>
          </div>
      </section>

            <div className="cta-content">
              <div className="cta-text">
                <h3>Sua Clínica ainda não usa a CLINIX?</h3>
                <p>
                  Aumente o fluxo de pacientes, reduza custos e modernize sua
                  gestão.
                </p>
              </div>
              <a href="#" className="btn-cta">Quero levar a CLINIX à minha Clínica</a>
            </div>
          </div>
        </section>
  )
}

export default Cta