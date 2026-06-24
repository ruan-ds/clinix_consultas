import React, { useState, useEffect } from 'react';
import { Search, Loader2, CheckCircle, XCircle, Clock, CalendarClock } from 'lucide-react';
import './dailyFlow.css';
import {
  getDailyFlow,
  checkInAppointment,
  cancelReceptionAppointment,
  type DailyAppointment,
} from '../../../../services/receptionService';

const statusLabel: Record<DailyAppointment['arrival_status'], string> = {
  waiting: 'Aguardando na Fila',
  checked_in: 'Check-in Completo',
  future: 'Agendamento Futuro',
  cancelled: 'Cancelado',
};

const statusClass: Record<DailyAppointment['arrival_status'], string> = {
  waiting: 'fd-badge fd-badge--waiting',
  checked_in: 'fd-badge fd-badge--done',
  future: 'fd-badge fd-badge--future',
  cancelled: 'fd-badge fd-badge--cancelled',
};

export const DailyFlow = () => {
  const [appointments, setAppointments] = useState<DailyAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
  });

  useEffect(() => {
    setLoading(true);
    getDailyFlow()
      .then(setAppointments)
      .catch(() => setErro('Não foi possível carregar o fluxo do dia.'))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = appointments.filter(
    (a) =>
      a.patient_name.toLowerCase().includes(busca.toLowerCase()) ||
      String(a.patient_id).includes(busca) ||
      a.specialty.toLowerCase().includes(busca.toLowerCase())
  );

  const handleCheckin = async (id: number) => {
    setActionLoading(id);
    try {
      await checkInAppointment(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, arrival_status: 'checked_in' } : a))
      );
    } catch {
      setErro('Erro ao realizar check-in. Tente novamente.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelar = async (id: number) => {
    setActionLoading(id);
    try {
      await cancelReceptionAppointment(id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, arrival_status: 'cancelled' } : a))
      );
    } catch {
      setErro('Erro ao cancelar consulta. Tente novamente.');
    } finally {
      setActionLoading(null);
    }
  };

  const counts = {
    waiting: appointments.filter((a) => a.arrival_status === 'waiting').length,
    checked_in: appointments.filter((a) => a.arrival_status === 'checked_in').length,
    future: appointments.filter((a) => a.arrival_status === 'future').length,
  };

  if (loading) {
    return (
      <div className="fd-loading">
        <Loader2 size={36} className="fd-spin" />
        <p>Carregando fluxo do dia...</p>
      </div>
    );
  }

  return (
    <div className="fd-container">
      <div className="fd-header">
        <div>
          <h1 className="fd-title">Fluxo do Dia</h1>
          <p className="fd-date">{today}</p>
        </div>
        <div className="fd-counters">
          <div className="fd-counter fd-counter--waiting">
            <Clock size={16} />
            <span>{counts.waiting} Aguardando</span>
          </div>
          <div className="fd-counter fd-counter--done">
            <CheckCircle size={16} />
            <span>{counts.checked_in} Check-in</span>
          </div>
          <div className="fd-counter fd-counter--future">
            <CalendarClock size={16} />
            <span>{counts.future} Futuros</span>
          </div>
        </div>
      </div>

      <div className="fd-search-wrap">
        <Search className="fd-search-icon" size={18} />
        <input
          className="fd-search-input"
          type="text"
          placeholder="Buscar pacientes por nome, CPF ou ID..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {erro && <p className="fd-erro">{erro}</p>}

      <div className="fd-table-header">
        <span>Hora</span>
        <span>Paciente (Nome / ID)</span>
        <span>Especialidade</span>
        <span>Status da Chegada</span>
        <span>Ações</span>
      </div>

      <div className="fd-list">
        {filtrados.length === 0 && (
          <p className="fd-empty">Nenhum paciente encontrado para os filtros atuais.</p>
        )}
        {filtrados.map((apt) => (
          <div
            key={apt.id}
            className={`fd-row ${apt.arrival_status === 'cancelled' ? 'fd-row--cancelled' : ''}`}
          >
            <div className="fd-cell fd-cell--time">{apt.time}</div>
            <div className="fd-cell fd-cell--patient">
              <span className="fd-patient-name">{apt.patient_name}</span>
              <span className="fd-patient-id">ID {apt.patient_id}</span>
            </div>
            <div className="fd-cell">{apt.specialty}</div>
            <div className="fd-cell">
              <span className={statusClass[apt.arrival_status]}>
                {statusLabel[apt.arrival_status]}
              </span>
            </div>
            <div className="fd-cell fd-cell--actions">
              {apt.arrival_status !== 'cancelled' && (
                <>
                  <button
                    className="fd-btn fd-btn--checkin"
                    disabled={actionLoading === apt.id || apt.arrival_status === 'checked_in'}
                    onClick={() => handleCheckin(apt.id)}
                  >
                    {actionLoading === apt.id ? (
                      <Loader2 size={14} className="fd-spin" />
                    ) : (
                      'Fazer Check-in'
                    )}
                  </button>
                  <button
                    className="fd-btn fd-btn--cancel"
                    disabled={actionLoading === apt.id}
                    onClick={() => handleCancelar(apt.id)}
                  >
                    Cancelar
                  </button>
                </>
              )}
              {apt.arrival_status === 'cancelled' && (
                <span className="fd-cancelled-label">
                  <XCircle size={14} /> Cancelado
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyFlow;
