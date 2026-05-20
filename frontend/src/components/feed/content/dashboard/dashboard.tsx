import React from 'react';
import './dashboard.css';
import Card from './card/card';
import { FaCalendarCheck } from "react-icons/fa";
import { AiOutlineFieldTime } from "react-icons/ai"
function Dashboard() {
    return (
        <div className="dashboard-wrapper">
            <header className="dashboard-header">
                <h1>Bem-vindo de volta, user!</h1> {/* Substituir dps pelo token com nome do user*/}
                <p>Sua saúde em dia.</p>
            </header>

            {/* Este grid vai organizar os elementos lado a lado */}
            <div className="dashboard-grid">
                
                {/* Lado Esquerdo - Card Principal */}
                <div className="main-card-section">
                    <Card />
                </div>

                {/* Lado Direito - Botões de Ação */}
                <div className="action-cards-section">
                    <button className="action-btn">
                        <span className="icon-placeholder"><FaCalendarCheck /></span> 
                        Agendar Nova Consulta
                    </button>
                    <button className="action-btn">
                        <span className="icon-placeholder"><AiOutlineFieldTime /></span> 
                        Ver Histórico Completo
                    </button>
                </div>

            </div>
        </div>
    )
}
export default Dashboard;