import React from 'react';
import './historyRecent.css';
import { FaCalendarCheck } from 'react-icons/fa';

function HistoryRecent(props: { historico: any[] }) {

    // Pega no máximo 3 itens
    const listaDeConsultas = (props.historico || []).slice(0, 3);

    // Define o indicativo (label + cor) de acordo com o status da consulta
    const getStatusBadge = (status: string, dateStr: string) => {
        if (status === 'cancelled') {
            return { label: 'Cancelada', colorClass: 'recent-status-red' };
        }
        const isPast = new Date(dateStr) < new Date();
        if (isPast) {
            return { label: 'Concluída', colorClass: 'recent-status-green' };
        }
        return { label: 'Agendada', colorClass: 'recent-status-blue' };
    };

    return (
        <div className="history-section">
            <h2 className="history-title">Histórico Recente</h2>
            
            <div className="history-list">
                {listaDeConsultas.length === 0 ? (
                    <div className="history-empty">
                        <p>Você ainda não tem histórico de consultas</p>
                    </div>
                ) : (
                    listaDeConsultas.map((item, index) => {
                        // 🔹 Formatação da data
                        const d = new Date(item.date);

                        const dateStr = d.toLocaleDateString('pt-BR');
                        const timeStr = d.toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        });

                        const statusBadge = getStatusBadge(item.status, item.date);

                        return (
                            <div key={index} className="history-item-card">
                                <div className="history-left-column">
                                    <div className="history-info">
                                        <span className="history-specialty">{item.service_name ?? item.specialty}</span>
                                        <span className="history-doctor">{item.doctor_name}</span>
                                        <span className="history-location">{item.location ?? item.clinic_name}</span>
                                        <span className={`recent-status-pill ${statusBadge.colorClass}`}>
                                            {statusBadge.label}
                                        </span>
                                    </div>
                                </div>
                                <div className="history-right-column">
                                    <div className="history-date">
                                        <FaCalendarCheck className="date-icon" />
                                        <span>{dateStr} às {timeStr}</span>
                                    </div>
                                    {typeof item.price === 'number' && (
                                        <div className="history-price-line">
                                            <span className="history-price-label">Valor:</span>
                                            <span className="history-price">{item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

export default HistoryRecent;