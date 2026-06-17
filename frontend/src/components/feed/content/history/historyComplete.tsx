import React, { useState } from 'react';
import './historyComplete.css';
import { listHistoryAppointments } from '../../../../services/patientService';

function HistoryComplete() {
    const [pesquisa, setPesquisa] = useState('');
    const [Historico, setHistorico] = useState<any[]>([]);

    // Busca o histórico completo de consultas
    React.useEffect(() => {
        listHistoryAppointments()
            .then((data) => setHistorico(data))
            .catch(() => setHistorico([]));
    }, []);

    const filtrados = Historico.filter(item => 
        item.specialty.toLowerCase().includes(pesquisa.toLowerCase()) ||
        item.doctor_name.toLowerCase().includes(pesquisa.toLowerCase())
    );

    return (
        <div className="history-complete-container">
            <header className="history-complete-header">
                <div className="title-section">
                    <h2>Histórico de Consultas</h2>
                </div>
                <div className="search-box">
                    <input 
                        type="text" 
                        placeholder="Pesquisar por especialidade ou médico..." 
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                    />
                </div>
            </header>

            <div className="history-cards-list">
                {filtrados.map((item) => {
                    // 🔹 Formatação da data
                    const d = new Date(item.date);

                    const dateStr = d.toLocaleDateString('pt-BR');
                    const timeStr = d.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    });

                    return (
                        <div key={item.id} className="complete-card-item">
                            <div className="card-info-side">
                                <div className="card-main-line">
                                    <span className="doctor-spec-txt">
                                        {item.doctor_name} - {item.specialty}
                                    </span>
                                </div>
                                <div className="card-details-block">
                                    <p>
                                        <strong>Data e Hora:</strong> {dateStr} às {timeStr}
                                    </p>
                                    <p>
                                        <strong>Serviço:</strong> {item.service_name ?? item.specialty}
                                    </p>
                                    {typeof item.price === 'number' && (
                                        <p>
                                            <strong>Valor:</strong> {item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </p>
                                    )}
                                    <p>
                                        <strong>Local:</strong> {item.location ?? item.clinic_name}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default HistoryComplete;