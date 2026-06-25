import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import './dashboard.css';
import {
  getDashboardStats,
  getRecentActions,
  validateNewRegistration,
  type DashboardStats,
  type RecentAction,
} from '../../../../services/clinixService';

export const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [actions, setActions] = useState<RecentAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErro(null);
    Promise.all([getDashboardStats(), getRecentActions()])
      .then(([statsData, actionsData]) => {
        setStats(statsData);
        setActions(actionsData);
      })
      .catch(() => setErro('Não foi possível carregar os dados do dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  const handleValidarCadastro = async () => {
    setValidating(true);
    try {
      await validateNewRegistration();
    } catch {
      setErro('Não foi possível validar o cadastro.');
    } finally {
      setValidating(false);
    }
  };

  // Geometria do gauge de ocupação (semicírculo)
  const occupancy = stats?.occupancy_rate ?? 0;

  if (loading) {
    return (
      <div className="dc-loading">
        <Loader2 size={36} className="dc-spin" />
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dc-container">
      <h1 className="dc-title">Dashboard Global de Operações BPO</h1>

      {erro && <p className="dc-erro">{erro}</p>}

      <div className="dc-cards-row">
        <div className="dc-card">
          <h2 className="dc-card-title">Cadastros Operados (Hoje)</h2>
          <p className="dc-big-number">{stats?.registrations_today}</p>
          <p className="dc-card-sub">Total em todas as clínicas</p>
          <button className="dc-btn-primary" onClick={handleValidarCadastro} disabled={validating}>
            {validating ? <Loader2 size={16} className="dc-spin" /> : 'Validar Cadastro'}
          </button>
        </div>

        <div className="dc-card dc-card--gauge">
          <h2 className="dc-card-title">Taxa de ocupação de rede</h2>
          <div className="dc-gauge-wrap">
            <svg viewBox="0 0 200 110" className="dc-gauge-svg">
              <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#e5e7eb" strokeWidth="16" strokeLinecap="round" />
              <path
                d="M 10 100 A 90 90 0 0 1 190 100"
                fill="none"
                stroke="#149488"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * occupancy) / 100}
              />
            </svg>
            <span className="dc-gauge-value">{occupancy}%</span>
          </div>
          <p className="dc-card-sub">Tempo médio de sala de espera: {stats?.avg_wait_time_minutes} min</p>
        </div>
      </div>

      <div className="dc-table-card">
        <h2 className="dc-table-title">Últimas Ações Operacionais BPO</h2>
        <div className="dc-table-header">
          <span>Data/Hora</span>
          <span>Operador</span>
          <span>Ação</span>
          <span>Clínica</span>
        </div>
        <div className="dc-table-body">
          {actions.map((a) => (
            <div key={a.id} className="dc-table-row">
              <span>{a.datetime}</span>
              <span>{a.operator}</span>
              <span>{a.action}</span>
              <span>{a.clinic}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;