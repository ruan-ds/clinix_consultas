import React, { useRef, useState, useEffect } from 'react';
import './dashboard.css';
import Card from './card/card';
import HistoryRecent from './history/historyRecent';
import { FaCalendarCheck } from "react-icons/fa";
import { AiOutlineFieldTime } from "react-icons/ai"
import imagem from '../../../../assets/images/imgdashboard.png';

interface DashboardProps {
    onVerHistorico: () => void;
    userName: string;
    onAgendar: () => void;
}

function Dashboard({ onVerHistorico, userName, onAgendar }: DashboardProps) {

    const [estado, setEstado] = useState(0);
    
    // proxima consulta é lista com os dados da consulta que iremos receber do backend e passsar pro componente de card
    //const proximaConsulta = null;
    
    const proximaConsulta = {
        doctorName: "Dr. Marcos Paulo",
        specialty: "Cardiologia",
        date: "25/05/2026",
        time: "14:30",
        location: "Consultório 3, Bloco B"
    };


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

    // Lógica para alternar o estado caso não haja consultas nem histórico
    useEffect(() => {
        if (proximaConsulta === null && (!Historico || Historico.length === 0)) {
            setEstado(1);
        } else {
            setEstado(0);
        }
    }, [proximaConsulta, Historico]);


    //. Destaque do histórico, animação
    const historicoRef = useRef<HTMLDivElement>(null);

    const lidarComVerHistorico = () => {
        // Faz a tela descer suavemente até o histórico e centralizá-lo
        // Ativa a classe de animação de destaque
        // Remove o destaque após 1.5 segundos (tempo do efeito piscar)

        // Avisa quem estiver controlando o Dashboard que o botão foi clicado
        onVerHistorico();
    };

    if (estado == 0){
    return (
        <div className="dashboard-wrapper">
            <header className="dashboard-header">
                <h1>Bem-vindo de volta, {userName.split(" ")[0]}</h1>
                <p>Sua saúde em dia.</p>
            </header>

            <div className="dashboard-grid">
                
                {/* Lado Esquerdo - Próxima Consulta */}
                <div className="main-card-section">
                    <Card appointment={proximaConsulta} />
                </div>

                {/* Lado Direito - Botões de Ação */}
                <div className="action-cards-section">
                    <button className="action-btn" onClick={onAgendar}>
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
                    className="history-grid-section"
                >
                    <HistoryRecent historico={Historico} />
                </div>

            </div>
        </div>
    )
}   else if (estado == 1) {
    return (
        <div className="dashboard-wrapper empty-state-container">
            <div className="empty-state-content">
                <img src={imagem} alt="Calendário Clinix" className="empty-state-img" />
                 <h2>Bem-vindo, {userName.split(" ")[0]}! Vamos agendar sua primeira consulta?</h2>
                <p>Você ainda não tem agendamentos ou históricos. Comece agora!</p>
                <button className="empty-state-btn">Agendar minha primeira consulta</button>
            </div>
        </div>
    )
}
} 
export default Dashboard;