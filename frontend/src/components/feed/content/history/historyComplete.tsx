import React, { useState } from 'react';
import './historyComplete.css';

interface HistoryCompleteProps {
    onVoltar?: () => void;
}

function HistoryComplete({ onVoltar }: HistoryCompleteProps) {
    const [pesquisa, setPesquisa] = useState('');

    // Array baseado no seu JSON original, acrescido apenas de 'id' e 'location' para compor o layout
    const Historico = [
        { 
            id: 1,
            specialty: "Cardiologia", 
            doctorName: "Dr. Marcos Paulo", 
            date: "10 de Março, 14:00",
            location: "Clínica Pró Saúde - Betim/MG"
        },
        { 
            id: 2,
            specialty: "Ortopedia", 
            doctorName: "Dra. Aline Silva", 
            date: "22 de Janeiro, 09:30",
            location: "Clínica Centro - Betim/MG"
        },
        { 
            id: 3,
            specialty: "Dermatologia", 
            doctorName: "Dr. Carlos Eduardo", 
            date: "15 de Dezembro, 16:15",
            location: "Hospital Alfa - Betim/MG"
        },
        { 
            id: 4,
            specialty: "Clínico Geral", 
            doctorName: "Dra. Fernanda Souza", 
            date: "05 de Novembro, 11:00",
            location: "Clínica Vida - Betim/MG"
        }
    ];

    const filtrados = Historico.filter(item => 
        item.specialty.toLowerCase().includes(pesquisa.toLowerCase()) ||
        item.doctorName.toLowerCase().includes(pesquisa.toLowerCase())
    );

    return (
        <div className="history-complete-container">
            <header className="history-complete-header">
                <div className="title-section">
                    <button className="btn-voltar-seta" onClick={onVoltar}>←</button>
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
                {filtrados.map((item) => (
                    <div key={item.id} className="complete-card-item">
                        <div className="card-info-side">
                            <div className="card-main-line">
                                <span className="doctor-spec-txt">{item.doctorName} - {item.specialty}</span>
                            </div>
                            <div className="card-details-block">
                                <p><strong>Data e Hora:</strong> {item.date}</p>
                                <p><strong>Local:</strong> {item.location}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HistoryComplete;