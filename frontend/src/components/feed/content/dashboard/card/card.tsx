import React from 'react';
import './card.css';

function Card() { 
    return ( 
        <div className="top-section">
            
            {/*<!-- Card Próxima Consulta -->*/}
            <div className="appointment-card">
                <span className="label">Próxima Consulta</span>
                <h2>Dr. Marcos Paulo - Cardiologista</h2>
                <div className="details">
                    <p>23 de Janeiro, 15:30</p>
                    <p>Clínica Pró Saúde - Av. Paulista, 1000</p>
                </div>
                <div className="card-actions">
                    <button className="btn btn-primary">Ver Detalhes</button>
                    <button className="btn btn-secondary">Reagendar</button>
                </div>
            </div>
        </div>
    )

}

export default Card;