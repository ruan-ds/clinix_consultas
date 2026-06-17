import React, { useRef, useState, useEffect } from 'react';
import './dashboard.css';
import Card from './card/card';
import { validateFeed, listHistoryAppointments } from '../../../../services/patientService';
import HistoryRecent from './history/historyRecent';
import { FaCalendarCheck } from "react-icons/fa";
import { AiOutlineFieldTime } from "react-icons/ai";
import imagem from '../../../../assets/images/imgdashboard.png';

interface DashboardProps {
    onVerHistorico: () => void;
    userName: string;
    onAgendar: () => void;
}

function Dashboard({ onVerHistorico, userName, onAgendar }: DashboardProps) {

    const [loading, setLoading] = useState(true);
    const [estado, setEstado] = useState(0);

    const [proximaConsulta, setProximaConsulta] = useState<{
        doctorName: string;
        specialty: string;
        date: string;
        time: string;
        location: string;
    } | null>(null);

    const [Historico, setHistorico] = useState<any[]>([]);

    useEffect(() => {
        let mounted = true;

        Promise.all([validateFeed(), listHistoryAppointments()])
            .then(([feedRes, historyRes]) => {
                if (!mounted) return;

                const next = feedRes.next_appointment;

                if (next) {
                    const d = new Date(next.date);

                    setProximaConsulta({
                        doctorName: next.doctor_name,
                        specialty: next.specialty,
                        date: d.toLocaleDateString('pt-BR'),
                        time: d.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        location: next.address,
                    });
                } else {
                    setProximaConsulta(null);
                }

                setHistorico(historyRes);

                if (next === null && (!historyRes || historyRes.length === 0)) {
                    setEstado(1);
                } else {
                    setEstado(0);
                }
            })
            .catch(() => {
                if (!mounted) return;
                setProximaConsulta(null);
                setHistorico([]);
                setEstado(1);
            })
            .finally(() => {
                if (!mounted) return;
                setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, []);

    const historicoRef = useRef<HTMLDivElement>(null);

    const lidarComVerHistorico = () => {
        onVerHistorico();
    };

    if (loading) {
        return (
            <div className="dashboard-wrapper">
                <p>Carregando...</p>
            </div>
        );
    }

    if (estado === 0) {
        return (
            <div className="dashboard-wrapper">
                <header className="dashboard-header">
                    <h1>Bem-vindo de volta, {userName.split(" ")[0]}</h1>
                    <p>Sua saúde em dia.</p>
                </header>

                <div className="dashboard-grid">

                    <div className="main-card-section">
                        <Card appointment={proximaConsulta} />
                    </div>

                    <div className="action-cards-section">
                        <button className="action-btn" onClick={onAgendar}>
                            <span className="icon-placeholder"><FaCalendarCheck /></span>
                            Agendar Nova Consulta
                        </button>

                        <button className="action-btn" onClick={lidarComVerHistorico}>
                            <span className="icon-placeholder"><AiOutlineFieldTime /></span>
                            Ver Histórico Completo
                        </button>
                    </div>

                    <div ref={historicoRef} className="history-grid-section">
                        <HistoryRecent historico={Historico} />
                    </div>

                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-wrapper empty-state-container">
            <div className="empty-state-content">
                <img src={imagem} alt="Calendário Clinix" className="empty-state-img" />
                <h2>Bem-vindo, {userName.split(" ")[0]}! Vamos agendar sua primeira consulta?</h2>
                <p>Você ainda não tem agendamentos ou históricos. Comece agora!</p>
                <button className="empty-state-btn" onClick={onAgendar}>
                    Agendar minha primeira consulta
                </button>
            </div>
        </div>
    );
}

export default Dashboard;