import React, { useEffect, useState } from 'react';
import { Loader2, Users, CalendarCheck, Clock, Activity } from 'lucide-react';
import './dashboard.css';
import {
  getAdminDashboardStats,
  type DashboardAdminStats,
} from '../../../../services/adminService';

interface DashboardProps {
  adminName: string;
}

export const Dashboard = ({ adminName }: DashboardProps) => {
  const [stats, setStats] = useState<DashboardAdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setErro(null);
    getAdminDashboardStats()
      .then(setStats)
      .catch(() => setErro('Não foi possível carregar os dados do dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="adm-loading">
        <Loader2 size={36} className="adm-spin" />
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  const occupancy = stats?.occupancy_rate ?? 0;
  const dashR = 90;
  const circumference = Math.PI * dashR;
  const strokeDashoffset = circumference * (1 - occupancy / 100);

  return (
    <div className="adm-container">
      <h1 className="adm-title">Dashboard</h1>

      {erro && <p className="adm-erro">{erro}</p>}

      <div className="adm-cards-row">
        <div className="adm-card">
          <div className="adm-card-icon"><CalendarCheck size={28} /></div>
          <h2 className="adm-card-title">Consultas Hoje</h2>
          <p className="adm-big-number">{stats?.total_appointments_today}</p>
          <p className="adm-card-sub">Agendamentos do dia</p>
        </div>

        <div className="adm-card">
          <div className="adm-card-icon"><Users size={28} /></div>
          <h2 className="adm-card-title">Médicos Ativos</h2>
          <p className="adm-big-number">{stats?.active_doctors}</p>
          <p className="adm-card-sub">Em atendimento hoje</p>
        </div>

        <div className="adm-card">
          <div className="adm-card-icon"><Activity size={28} /></div>
          <h2 className="adm-card-title">Recepcionistas</h2>
          <p className="adm-big-number">{stats?.active_receptionists}</p>
          <p className="adm-card-sub">Ativos no momento</p>
        </div>

        <div className="adm-card adm-card--gauge">
          <h2 className="adm-card-title">Taxa de Ocupação</h2>
          <div className="adm-gauge-wrap">
            <svg viewBox="0 0 200 110" className="adm-gauge-svg">
              <path d="M 10 100 A 90 90 0 0 1 190 100" fill="none" stroke="#e5e7eb" strokeWidth="16" strokeLinecap="round" />
              <path
                d="M 10 100 A 90 90 0 0 1 190 100"
                fill="none"
                stroke="#149488"
                strokeWidth="16"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.8s ease' }}
              />
            </svg>
            <span className="adm-gauge-label">{occupancy}%</span>
          </div>
          <p className="adm-card-sub">Capacidade da clínica</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
