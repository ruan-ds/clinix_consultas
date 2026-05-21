import React, { useRef, useState } from 'react';
import './dashboard.css';
import Card from './card/card';
import History from './history/history'; 
import { FaCalendarCheck } from "react-icons/fa";
import { AiOutlineFieldTime } from "react-icons/ai"

function Dashboard() {
    
    // proxima consulta é lista com os dados da consulta que iremos receber do backend e passsar pro componente de card
    const proximaConsulta = null;
    /*
    const proximaConsulta = {
        doctorName: "Dr. Marcos Paulo",
        specialty: "Cardiologia",
        date: "25/05/2026",
        time: "14:30",
        location: "Consultório 3, Bloco B"
    };
    */

    // aqui sao as informações do historico de consultas do paciente, que será passado pelo back
    //const Historico: any[] = [];
    
    const Historico = [
    { 
        specialty: "Cardiologia", 
        doctorName: "Dr. Marcos Paulo", 
        date: "10 de Março, 14:00" 
    },
    { 
        specialty: "Ortopedia", 
        doctorName: "Dra. Aline Silva", 
        date: "22 de Janeiro, 09:30" 
    },
    { 
        specialty: "Dermatologia", 
        doctorName: "Dr. Carlos Eduardo", 
        date: "15 de Dezembro, 16:15" 
    },
    { 
        specialty: "Clínico Geral", 
        doctorName: "Dra. Fernanda Souza", 
        date: "05 de Novembro, 11:00" 
    }
    ];


    //. Destaque do histórico, animação
    const historicoRef = useRef<HTMLDivElement>(null);
    const [destacarHistorico, setDestacarHistorico] = useState(false);

    const lidarComVerHistorico = () => {
        // Faz a tela descer suavemente até o histórico e centralizá-lo
        historicoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Ativa a classe de animação de destaque
        setDestacarHistorico(true);
        
        // Remove o destaque após 1.5 segundos (tempo do efeito piscar)
        setTimeout(() => {
            setDestacarHistorico(false);
        }, 1500);
    };

    return (
        <div className="dashboard-wrapper">
            <header className="dashboard-header">
                <h1>Bem-vindo de volta, user!</h1>
                <p>Sua saúde em dia.</p>
            </header>

            <div className="dashboard-grid">
                
                {/* Lado Esquerdo - Próxima Consulta */}
                <div className="main-card-section">
                    <Card appointment={proximaConsulta} />
                </div>

                {/* Lado Direito - Botões de Ação */}
                <div className="action-cards-section">
                    <button className="action-btn">
                        <span className="icon-placeholder"><FaCalendarCheck /></span> 
                        Agendar Nova Consulta
                    </button>
                    
                    {/* Evento de clique adicionado neste botão*/}
                    <button className="action-btn" onClick={lidarComVerHistorico}>
                        <span className="icon-placeholder"><AiOutlineFieldTime /></span> 
                        Ver Histórico Completo
                    </button>
                </div>

                {/* Container do Histórico com a Ref e a classe de Destaque condicional */}
                <div 
                    ref={historicoRef} 
                    className={`history-grid-section ${destacarHistorico ? 'pulse-highlight' : ''}`}
                >
                    <History historico={Historico} />
                </div>

            </div>
        </div>
    )
}
export default Dashboard;