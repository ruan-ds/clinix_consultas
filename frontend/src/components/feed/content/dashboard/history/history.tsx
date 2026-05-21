import React from 'react';
import './history.css';
import { FaCalendarCheck } from 'react-icons/fa'; // Reutilizando o ícone que você já usa!

function History(props: { historico: any[] }) {

    // Pega a lista enviada pelo Dashboard se o Dashboard não mandar, vira uma lista vazia []
    const listaDeConsultas = props.historico || [];

    return (
        <div className="history-section">
            <h2 className="history-title">Histórico Recente</h2>
            
            <div className="history-list">
                {/* Se a lista estiver vazia mostra mensagem que não há consultas */}
                {listaDeConsultas.length === 0 ? (
                    <div className="history-empty">
                        <p>Você ainda não tem histórico de consultas</p>
                    </div>
                ) : (
                    /* Se tiver alguma coisa repete esse bloco abaixo para cada consulta da lista */
                    /* O map percorre a lista de consultas (listaDeConsultas) e renderiza um card para cada item.
                    -  item: representa cada objeto da lista (cada consulta)
                    - index: é a posição do item no array (0, 1, 2...)
                    - key: usada pelo React para identificar cada elemento da lista (aqui está usando o index, mas o ideal é usar um id único)
                    */
                    listaDeConsultas.map((item, index) => (
                        <div key={index} className="history-item-card">
                            <div className="history-info">
                                <span className="history-specialty">{item.specialty}</span>
                                <span className="history-doctor">{item.doctorName}</span>
                            </div>
                            <div className="history-date">
                                <FaCalendarCheck className="date-icon" />
                                <span>{item.date}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default History;