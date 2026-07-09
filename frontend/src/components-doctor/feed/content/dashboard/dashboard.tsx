import React, { useEffect, useState } from 'react';
import './dashboard.css';
import {
  getDoctorAgenda,
  iniciarAtendimento,
  encerrarAtendimento,
  type AgendaItem,
} from '../../../../services/doctorService';
import { Loader2, CalendarDays } from 'lucide-react';

interface DashboardProps {
  userName: string;
  userSpecialty?: string;
}

const STATUS_CONFIG = {
  no_consultorio: {
    label: 'No Consultório',
    dot: '#22c55e',
    badge: 'badge-green',
    tempo: (min: number) => `Há ${min} min`,
  },
  em_triagem: {
    label: 'Em Triagem',
    dot: '#22c55e',
    badge: 'badge-green',
    tempo: (min: number) => `Há ${min} min`,
  },
  urgencia: {
    label: 'Urgência Detectada',
    dot: '#ef4444',
    badge: 'badge-red',
    tempo: () => '',
  },
  ausente: {
    label: 'Paciente Ausente',
    dot: '#ef4444',
    badge: 'badge-red',
    tempo: () => '',
  },
  aguardando: {
    label: 'Aguardando na Recepção',
    dot: '#f59e0b',
    badge: 'badge-yellow',
    tempo: (min: number) => `Há ${min} min`,
  },
};

const ESTADO_LABEL: Record<string, string> = {
  Normal: 'Normal',
  Acompanhamento: 'Acompanhamento',
  Prioridade: 'Prioridade',
  Atrasado: 'Atrasado',
};

function Dashboard({ userName, userSpecialty }: DashboardProps) {
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [acao, setAcao] = useState<number | null>(null);
  const [dataAtiva, setDataAtiva] = useState(() => {
    const hoje = new Date();
    return hoje.toISOString().split('T')[0];
  });

  const dataFormatada = new Date(dataAtiva + 'T12:00:00').toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const dataCapitalizada =
    dataFormatada.charAt(0).toUpperCase() + dataFormatada.slice(1);

  useEffect(() => {
    setLoading(true);
    getDoctorAgenda(dataAtiva)
      .then(setAgenda)
      .finally(() => setLoading(false));
  }, [dataAtiva]);

  const handleIniciar = async (id: number) => {
    setAcao(id);
    try {
      await iniciarAtendimento(id);
      setAgenda((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, filaStatus: 'no_consultorio', filaTempoMin: 0 }
            : item
        )
      );
    } finally {
      setAcao(null);
    }
  };

  const handleEncerrar = async (id: number) => {
    setAcao(id);
    try {
      await encerrarAtendimento(id);
      setAgenda((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setAcao(null);
    }
  };

  const isLoading = (id: number) => acao === id;

  return (
    <div className="doc-dashboard-wrapper">
      {/* Header */}
      <header className="doc-dash-header">
        <h1>Dra. {userName.split(' ')[0]} — Sua Agenda de Hoje</h1>
        {userSpecialty && <span className="doc-specialty-badge">{userSpecialty}</span>}
        <div className="doc-date-pill">
          <CalendarDays size={16} />
          <span>{dataCapitalizada}</span>
          <input
            type="date"
            className="doc-date-input"
            value={dataAtiva}
            onChange={(e) => setDataAtiva(e.target.value)}
            title="Trocar data"
          />
        </div>
      </header>

      {/* Table */}
      {loading ? (
        <div className="doc-loading">
          <Loader2 size={32} className="doc-spin" />
          <p>Carregando agenda...</p>
        </div>
      ) : agenda.length === 0 ? (
        <div className="doc-empty">
          <CalendarDays size={48} color="#d1d5db" />
          <p>Nenhuma consulta para este dia.</p>
        </div>
      ) : (
        <div className="doc-table-wrapper">
        <table className="doc-agenda-table">
          <colgroup>
          <col />
          <col />
          <col />
          <col />
          <col />
          </colgroup>
          <thead>
            <tr>
              <th>Hora</th>
              <th>Paciente (Nome | Idade)</th>
              <th>Motivo / Especialidade</th>
              <th>Fila &amp; Estado Clínico</th>
              <th>Ações</th>
            </tr>
          </thead>
            <tbody>
              {agenda.map((item) => {
                const cfg = STATUS_CONFIG[item.filaStatus];
                const tempoLabel =
                  item.filaTempoMin > 0 ? cfg.tempo(item.filaTempoMin) : '';
                const emAtendimento = item.filaStatus === 'no_consultorio';
                const podeIniciar =
                  item.filaStatus === 'aguardando' ||
                  item.filaStatus === 'urgencia';

                return (
                  <tr key={item.id} className={`doc-row ${item.filaStatus === 'urgencia' ? 'row-urgencia' : ''}`}>
                    <td className="doc-cell-hora">{item.hora}</td>
                    <td className="doc-cell-paciente">
                      <strong>{item.pacienteNome}</strong>
                      <span className="doc-idade">{item.pacienteIdade} anos</span>
                    </td>
                    <td className="doc-cell-motivo">
                      <span>{item.motivo}</span>
                      <span className="doc-esp-tag">{item.especialidade}</span>
                    </td>
                    <td className="doc-cell-fila">
                      <div className="doc-fila-row">
                        <span
                          className="doc-status-dot"
                          style={{ backgroundColor: cfg.dot }}
                        />
                        <span className="doc-status-label">
                          {cfg.label}
                          {tempoLabel && (
                            <span className="doc-tempo"> {tempoLabel}</span>
                          )}
                        </span>
                      </div>
                      <span className="doc-estado-clinico">
                        *{ESTADO_LABEL[item.estadoClinico]}*
                      </span>
                    </td>
                    <td className="doc-cell-acoes">
                      {emAtendimento ? (
                        <button
                          className="doc-btn doc-btn-encerrar"
                          onClick={() => handleEncerrar(item.id)}
                          disabled={isLoading(item.id)}
                        >
                          {isLoading(item.id) ? (
                            <Loader2 size={14} className="doc-spin" />
                          ) : (
                            '▶ Encerrar Atendimento'
                          )}
                        </button>
                      ) : (
                        <button
                          className={`doc-btn doc-btn-iniciar ${!podeIniciar ? 'doc-btn-disabled' : ''}`}
                          onClick={() => podeIniciar && handleIniciar(item.id)}
                          disabled={!podeIniciar || isLoading(item.id)}
                        >
                          {isLoading(item.id) ? (
                            <Loader2 size={14} className="doc-spin" />
                          ) : (
                            '▶ Iniciar Atendimento'
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
