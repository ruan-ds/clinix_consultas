import React from 'react';
import './historyRecent.css';
import { FaCalendarCheck } from 'react-icons/fa';

function HistoryRecent(props: { historico: any[] }) {

    // Pega no máximo 3 itens
    const listaDeConsultas = (props.historico || []).slice(0, 3);

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

                        return (
                            <div key={index} className="history-item-card">
                                <div className="history-info">
                                    <span className="history-specialty">{item.specialty}</span>
                                    <span className="history-doctor">{item.doctor_name}</span>
                                </div>
                                <div className="history-date">
                                    <FaCalendarCheck className="date-icon" />
                                    <span>{dateStr} às {timeStr}</span>
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