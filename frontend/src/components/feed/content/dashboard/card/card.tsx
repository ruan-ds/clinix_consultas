import React from 'react';
import './card.css'; 
import { FiCalendar, FiClock, FiMapPin } from "react-icons/fi"; 

interface AppointmentData {
    doctorName: string;
    specialty: string;
    date: string;
    time: string;
    location: string;
}

interface CardProps {
    appointment?: AppointmentData | null; // Pode receber a consulta ou ser nulo
}

function Card({ appointment }: CardProps) {
    
    // CASO ESTEJA VAZIO: Renderiza o aviso amigável
    if (!appointment) {
        return (
            <div className="appointment-card empty-card">
                <div className="card-header-status">
                    <span className="status-badge no-appointment">Sem Agendamentos</span>
                </div>
                <div className="card-empty-content">
                    <h3>Nenhuma consulta marcada</h3>
                    <p>Você não possui nenhuma consulta agendada para os próximos dias.</p>
                </div>
            </div>
        );
    }

    // CASO TENHA DADOS: Renderiza o layout padrão perfeitamente
    return (
        <div className="appointment-card">
            <div className="card-header-status">
                <span className="status-badge">Próxima Consulta</span>
            </div>
            
            <div className="card-main-content">
                <div className="doctor-info-block">
                    <div className="doctor-text">
                        <h3>{appointment.doctorName}</h3>
                        <p className="specialty-text">{appointment.specialty}</p>
                    </div>
                </div>

                <div className="appointment-details-grid">
                    <div className="detail-item">
                        <FiCalendar className="detail-icon" />
                        <span>{appointment.date}</span>
                    </div>
                    <div className="detail-item">
                        <FiClock className="detail-icon" />
                        <span>{appointment.time}</span>
                    </div>
                    <div className="detail-item full-width-detail">
                        <FiMapPin className="detail-icon" />
                        <span>{appointment.location}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;