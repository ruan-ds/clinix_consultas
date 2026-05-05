import React from 'react';
import './benefits.css';

function Benefits() {
  return (
    <section className="benefits-section">
      <h2 className="section-title">Por que usar o Clinix?</h2>
      <div className="benefits-grid">
        <article className="benefit-card">
          <svg viewBox="0 0 24 24" className="benefit-icon">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <h3>Milhares de Opções</h3>
          <p>Com parceiros de todo o Brasil na sua busca.</p>
        </article>

        <article className="benefit-card middle-card">
          <svg viewBox="0 0 24 24" className="benefit-icon">
            <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
          </svg>
          <h3>Transparência</h3>
          <p>Comparar horários e escolha a melhor oferta.</p>
        </article>

        <article className="benefit-card">
          <svg viewBox="0 0 24 24" className="benefit-icon">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
          </svg>
          <h3>Confirmação Instantânea</h3>
          <p>Receba sua prova de agendamento e lembrete de gestão.</p>
        </article>
      </div>
    </section>
  );
}

export default Benefits;
