import React from 'react';
import './card.css'; // Certifique-se de que o arquivo CSS está na mesma pasta
import { FiCalendar, FiClock, FiMapPin, FiUser } from "react-icons/fi"; // Certifique-se de ter o react-icons instalado

// Definindo o formato dos dados que o Back-end vai enviar
interface AppointmentCardProps {
    doctorName?: string;
    specialty?: string;
    date?: string;
    time?: string;
    location?: string;
}

function Card({ 
    doctorName = "Nome do Profissional", 
    specialty = "Especialidade", 
    date = "--/--/----", 
    time = "--:--", 
    location = "Local da consulta" 
}: AppointmentCardProps) {
    
    return (
        <div className="appointment-card">
            <div className="card-header-status">
                <span className="status-badge">Próxima Consulta</span>
            </div>
            
            <div className="card-main-content">
                {/* Informações do Médico */}
                <div className="doctor-info-block">
                    <div className="doctor-text">
                        <h3>{doctorName}</h3>
                        <p className="specialty-text">{specialty}</p>
                    </div>
                </div>

                {/* Detalhes de Data, Hora e Local */}
                <div className="appointment-details-grid">
                    <div className="detail-item">
                        <FiCalendar className="detail-icon" />
                        <span>{date}</span>
                    </div>
                    <div className="detail-item">
                        <FiClock className="detail-icon" />
                        <span>{time}</span>
                    </div>
                    <div className="detail-item full-width-detail">
                        <FiMapPin className="detail-icon" />
                        <span>{location}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;