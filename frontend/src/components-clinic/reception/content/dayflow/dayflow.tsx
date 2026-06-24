import React, { useState, useEffect, useCallback } from 'react';
import './dayflow.css';
import { Search, Loader2 } from 'lucide-react';
import {
  getDayFlow,
  checkInPatient,
  cancelAppointmentReception,
  type DayFlowItem,
  type ArrivalStatus,
} from '../../../../services/receptionService';

interface DayFlowProps {
  onAgendar: () => void;
  onCadastro: () => void;
}

// ─── Mock local ────────────────────────────────────────────────────
// Usado enquanto o endpoint GET /api/reception/day-flow não existe.
// Para ativar os dados reais, remova este mock e descomente o bloco
// de chamada de API dentro do useEffect abaixo.
const MOCK_ITEMS: DayFlowItem[] = [
  { id: 1, time: '08:00', patientName: 'Joaquim S. de Moraes', patientId: 'ID 10455', specialty: 'Odontologia',   arrivalStatus: 'Aguardando na Fila'  },
  { id: 2, time: '08:30', patientName: 'Maria Santos',          patientId: 'ID 11300', specialty: 'Pediatria',     arrivalStatus: 'Check-in Completo'    },
  { id: 3, time: '09:15', patientName: 'João Pedro',            patientId: 'ID 12150', specialty: 'Odontologia',   arrivalStatus: 'Check-in Completo'    },
  { id: 4, time: '10:00', patientName: 'Ana Carolina Lima',     patientId: 'ID 13400', specialty: 'Triagem Geral', arrivalStatus: 'Agendamento Futuro'   },
  { id: 5, time: '10:30', patientName: 'Carlos Eduardo',        patientId: 'ID 13501', specialty: 'Cardiologia',   arrivalStatus: 'Aguardando na Fila'   },
  { id: 6, time: '11:00', patientName: 'Fernanda Lima',         patientId: 'ID 13600', specialty: 'Dermatologia',  arrivalStatus: 'Agendamento Futuro'   },
  { id: 7, time: '11:30', patientName: 'Roberto Alves',         patientId: 'ID 13710', specialty: 'Ortopedia',     arrivalStatus: 'Check-in Completo'    },
  { id: 8, time: '12:00', patientName: 'Luciana Pereira',       patientId: 'ID 13820', specialty: 'Ginecologia',   arrivalStatus: 'Aguardando na Fila'   },
  { id: 9, time: '13:00', patientName: 'Paulo Henrique',        patientId: 'ID 13930', specialty: 'Clínica Geral', arrivalStatus: 'Agendamento Futuro'   },
  { id: 10, time: '13:30', patientName: 'Beatriz Costa',        patientId: 'ID 14040', specialty: 'Pediatria',     arrivalStatus: 'Aguardando na Fila'   },
];

const PAGE_SIZE = 4;

const STATUS_LABEL: Record<ArrivalStatus, { label: string; className: string }> = {
  'Aguardando na Fila':  { label: 'Aguardando na Fila',  className: 'status-waiting'  },
  'Check-in Completo':   { label: 'Check-in Completo',   className: 'status-done'     },
  'Agendamento Futuro':  { label: 'Agendamento Futuro',  className: 'status-future'   },
  'Cancelado':           { label: 'Cancelado',           className: 'status-cancelled' },
  'Atendido':            { label: 'Atendido',            className: 'status-attended'  },
};

function DayFlow({ onAgendar, onCadastro }: DayFlowProps) {
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [items, setItems]         = useState<DayFlowItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading]     = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [erro, setErro]           = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      // ── Dados reais (descomentar quando o endpoint estiver pronto) ──
      // const data = await getDayFlow(search, page);
      // setItems(data.items);
      // setTotalPages(data.totalPages);

      // ── Mock temporário ─────────────────────────────────────────────
      await new Promise((r) => setTimeout(r, 300)); // simula latência
      const filtered = MOCK_ITEMS.filter(
        (i) =>
          i.patientName.toLowerCase().includes(search.toLowerCase()) ||
          i.patientId.toLowerCase().includes(search.toLowerCase()) ||
          i.specialty.toLowerCase().includes(search.toLowerCase())
      );
      setTotalPages(Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)));
      setItems(filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE));
    } catch {
      setErro('Não foi possível carregar o fluxo do dia.');
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    load();
  }, [load]);

  // Debounce para a busca (evita reload a cada tecla)
  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleCheckIn = async (id: number) => {
    setActionLoading(id);
    try {
      // await checkInPatient(id);  ← ativar quando o endpoint existir
      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, arrivalStatus: 'Check-in Completo' as ArrivalStatus } : i
        )
      );
    } catch {
      setErro('Erro ao realizar check-in.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancel = async (id: number) => {
    setActionLoading(id);
    try {
      // await cancelAppointmentReception(id);  ← ativar quando o endpoint existir
      setItems((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, arrivalStatus: 'Cancelado' as ArrivalStatus } : i
        )
      );
    } catch {
      setErro('Erro ao cancelar agendamento.');
    } finally {
      setActionLoading(null);
    }
  };

  // Páginas a exibir na paginação (1, 2, 3 ... último)
  const buildPages = (): (number | '...')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | '...')[] = [1, 2, 3];
    if (page > 4) pages.push('...');
    if (page > 3 && page < totalPages - 1) pages.push(page);
    pages.push('...');
    pages.push(totalPages);
    return pages;
  };

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="df-container">

      {/* Cabeçalho */}
      <div className="df-header">
        <h1 className="df-title">Fluxo do Dia</h1>
        <p className="df-date">{today.charAt(0).toUpperCase() + today.slice(1)}</p>
      </div>

      {/* Barra de busca */}
      <div className="df-search-wrapper">
        <Search className="df-search-icon" size={18} />
        <input
          className="df-search-input"
          type="text"
          placeholder="Buscar pacientes por nome, CPF ou ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {erro && <p className="df-error">{erro}</p>}

      {/* Tabela */}
      <div className="df-table-wrapper">
        <table className="df-table">
          <thead>
            <tr>
              <th>Hora</th>
              <th>Paciente (Nome / ID)</th>
              <th>Especialidade</th>
              <th>Status da Chegada</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="df-loading-cell">
                  <Loader2 size={24} className="df-spin" />
                  <span>Carregando...</span>
                </td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5} className="df-empty-cell">
                  Nenhum paciente encontrado para esta busca.
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const statusInfo = STATUS_LABEL[item.arrivalStatus];
                const isCancelled = item.arrivalStatus === 'Cancelado';
                const isActing = actionLoading === item.id;

                return (
                  <tr key={item.id} className={isCancelled ? 'df-row-cancelled' : ''}>
                    <td className="df-col-time">{item.time}</td>
                    <td className="df-col-patient">
                      <span className="df-patient-name">{item.patientName}</span>
                      <span className="df-patient-id">{item.patientId}</span>
                    </td>
                    <td className="df-col-specialty">{item.specialty}</td>
                    <td className="df-col-status">
                      <span className={`df-status-badge ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="df-col-actions">
                      {!isCancelled && (
                        <>
                          <button
                            className="df-btn df-btn-checkin"
                            onClick={() => handleCheckIn(item.id)}
                            disabled={isActing || item.arrivalStatus === 'Check-in Completo'}
                          >
                            {isActing
                              ? <Loader2 size={14} className="df-spin" />
                              : 'Fazer Check-in'}
                          </button>
                          <button
                            className="df-btn df-btn-cancel"
                            onClick={() => handleCancel(item.id)}
                            disabled={isActing}
                          >
                            Cancelar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      {!loading && totalPages > 1 && (
        <div className="df-pagination">
          <button
            className="df-page-btn"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Anterior
          </button>
          <span className="df-page-sep">|</span>
          {buildPages().map((p, idx) =>
            p === '...' ? (
              <span key={`ellipsis-${idx}`} className="df-page-ellipsis">...</span>
            ) : (
              <button
                key={p}
                className={`df-page-btn ${page === p ? 'df-page-btn--active' : ''}`}
                onClick={() => setPage(p as number)}
              >
                {p}
              </button>
            )
          )}
          <span className="df-page-sep">|</span>
          <button
            className="df-page-btn"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Próximo
          </button>
        </div>
      )}
    </div>
  );
}

export default DayFlow;
