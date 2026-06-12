import React, { useState, useEffect } from 'react';
import './activeAppointments.css';
import { getActiveAppointments, cancelAppointment, type AppointmentHistoryItem } from '../../../../services/patientService';
import { Loader2, CalendarX, MapPin, Stethoscope, User, Clock } from 'lucide-react';

function ActiveAppointments() {
    const [consultas, setConsultas] = useState<AppointmentHistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [cancelando, setCancelando] = useState<number | null>(null);
    const [pesquisa, setPesquisa] = useState('');
    const [visibilityModal, setVisibilityModal] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    const carregarConsultas = () => {
        setLoading(true);
        setErro(null);
        getActiveAppointments()
            .then(setConsultas)
            .catch(() => setErro('Não foi possível carregar as consultas ativas.'))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        carregarConsultas();
    }, []);

    const handleCancelar = async () => {
        if (selectedId === null) return;
        setCancelando(selectedId);
        setVisibilityModal(false);
        try {
            await cancelAppointment(selectedId);
            setConsultas(prev => prev.filter(c => c.id !== selectedId));
        } catch {
            setErro('Não foi possível cancelar a consulta. Tente novamente.');
        } finally {
            setCancelando(null);
            setSelectedId(null);
        }
    };

    const abrirModal = (id: number) => {
        setSelectedId(id);
        setVisibilityModal(true);
    };

    const formatarData = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleString('pt-BR', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit',
            timeZone: 'America/Sao_Paulo'
        });
    };

    const filtradas = consultas.filter(c =>
        c.doctor_name.toLowerCase().includes(pesquisa.toLowerCase()) ||
        c.specialty.toLowerCase().includes(pesquisa.toLowerCase()) ||
        c.clinic_name.toLowerCase().includes(pesquisa.toLowerCase())
    );

    return (
        <div className="active-container">

            {visibilityModal && (
                <div id="modalappointment">
                    <div>
                        <p>Você realmente deseja cancelar esta consulta?</p>
                    <div className="modal-actions">
                        <button onClick={handleCancelar}>Sim</button>
                        <button onClick={() => { setVisibilityModal(false); setSelectedId(null); }}>Cancelar</button>
                    </div>
                </div>
        </div>
            )}

            <header className="active-header">
                <div className="active-title-section">
                    <h2>Consultas Ativas</h2>
                    {!loading && (
                        <span className="active-badge">{consultas.length}</span>
                    )}
                </div>
                <div className="active-search-box">
                    <input
                        type="text"
                        placeholder="Pesquisar por médico, especialidade..."
                        value={pesquisa}
                        onChange={(e) => setPesquisa(e.target.value)}
                    />
                </div>
            </header>

            {erro && <p className="active-erro">{erro}</p>}

            {loading ? (
                <div className="active-loading">
                    <Loader2 size={32} className="active-spin" />
                    <p>Carregando consultas...</p>
                </div>
            ) : filtradas.length === 0 ? (
                <div className="active-empty">
                    <CalendarX size={48} color="#d1d5db" />
                    <p>Nenhuma consulta agendada encontrada.</p>
                </div>
            ) : (
                <div className="active-cards-list">
                    {filtradas.map((item) => (
                        <div key={item.id} className="active-card-item">
                            <div className="active-card-left">
                                <div className="active-card-main-line">
                                    <User size={15} className="active-icon-inline" />
                                    <span className="active-doctor-txt">{item.doctor_name}</span>
                                    <span className="active-spec-pill">{item.specialty}</span>
                                </div>
                                <div className="active-card-details">
                                    <p>
                                        <Clock size={14} className="active-icon-inline" />
                                        <strong>Data:</strong> {formatarData(String(item.date))}
                                    </p>
                                    <p>
                                        <Stethoscope size={14} className="active-icon-inline" />
                                        <strong>Clínica:</strong> {item.clinic_name}
                                    </p>
                                    <p>
                                        <MapPin size={14} className="active-icon-inline" />
                                        <strong>Endereço:</strong> {item.address}
                                    </p>
                                </div>
                            </div>
                            <div className="active-card-right">
                                <span className="active-status-pill">Agendada</span>
                                <button
                                    className="active-btn-cancelar"
                                    onClick={() => abrirModal(item.id)}
                                    disabled={cancelando === item.id}
                                >
                                    {cancelando === item.id
                                        ? <Loader2 size={16} className="active-spin" />
                                        : 'Cancelar'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default ActiveAppointments;