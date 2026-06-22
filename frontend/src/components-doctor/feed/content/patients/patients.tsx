import React, { useEffect, useState } from 'react';
import './patients.css';
import {
  getDoctorPatients,
  getPatientById,
  type Patient,
} from '../../../../services/doctorService';
import { Loader2, Users, X, FileText, Pill, AlertTriangle } from 'lucide-react';

function Patients() {
  const [pacientes, setPacientes] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [ordem, setOrdem] = useState<'recentes' | 'az'>('recentes');
  const [prontuario, setProntuario] = useState<Patient | null>(null);
  const [loadingProntuario, setLoadingProntuario] = useState(false);

  useEffect(() => {
    setLoading(true);
    getDoctorPatients()
      .then(setPacientes)
      .finally(() => setLoading(false));
  }, []);

  const filtrados = pacientes
    .filter(
      (p) =>
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.cpf.includes(busca) ||
        String(p.id).includes(busca)
    )
    .sort((a, b) =>
      ordem === 'az'
        ? a.nome.localeCompare(b.nome)
        : new Date(b.ultimaConsulta).getTime() - new Date(a.ultimaConsulta).getTime()
    );

  const abrirProntuario = async (id: number) => {
    setLoadingProntuario(true);
    try {
      const p = await getPatientById(id);
      setProntuario(p);
    } finally {
      setLoadingProntuario(false);
    }
  };

  const formatarData = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).toUpperCase();

  return (
    <div className="pat-container">
      {/* Modal prontuário */}
      {(prontuario || loadingProntuario) && (
        <div className="pat-modal-overlay" onClick={() => setProntuario(null)}>
          <div className="pat-modal" onClick={(e) => e.stopPropagation()}>
            <button className="pat-modal-close" onClick={() => setProntuario(null)}>
              <X size={20} />
            </button>
            {loadingProntuario ? (
              <div className="pat-modal-loading">
                <Loader2 size={28} className="pat-spin" />
                <p>Carregando prontuário...</p>
              </div>
            ) : prontuario ? (
              <>
                <div className="pat-modal-header">
                  <div className="pat-modal-avatar">
                    <span>{prontuario.nome.charAt(0)}</span>
                  </div>
                  <div>
                    <h2>{prontuario.nome}</h2>
                    <p>ID {prontuario.id} · {prontuario.idade} anos · CPF {prontuario.cpf}</p>
                  </div>
                </div>

                <div className="pat-modal-section">
                  <div className="pat-modal-section-title">
                    <FileText size={15} /> Resumo Clínico
                  </div>
                  <p className="pat-modal-text">{prontuario.prontuarioResumo}</p>
                </div>

                <div className="pat-modal-section">
                  <div className="pat-modal-section-title">
                    <FileText size={15} /> Diagnósticos
                  </div>
                  <ul className="pat-modal-list">
                    {prontuario.diagnosticos.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                </div>

                <div className="pat-modal-section">
                  <div className="pat-modal-section-title">
                    <AlertTriangle size={15} /> Alergias
                  </div>
                  <ul className="pat-modal-list">
                    {prontuario.alergias.map((a, i) => <li key={i}>{a}</li>)}
                  </ul>
                </div>

                <div className="pat-modal-section">
                  <div className="pat-modal-section-title">
                    <Pill size={15} /> Medicamentos em uso
                  </div>
                  <ul className="pat-modal-list">
                    {prontuario.medicamentos.map((m, i) => <li key={i}>{m}</li>)}
                  </ul>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Header */}
      <header className="pat-header">
        <h2>Meus Pacientes</h2>
      </header>

      {/* Controls */}
      <div className="pat-controls">
        <input
          type="text"
          placeholder="Buscar pacientes por nome, CPF ou ID..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pat-search"
        />
        <select
          className="pat-select"
          value={ordem}
          onChange={(e) => setOrdem(e.target.value as 'recentes' | 'az')}
        >
          <option value="recentes">Recentes</option>
          <option value="az">A–Z</option>
        </select>
      </div>

      {/* Table header row */}
      <div className="pat-table-header">
        <span>Paciente info</span>
        <span>Última Consulta</span>
        <span className="pat-col-acoes">Ações</span>
      </div>

      {/* Rows */}
      {loading ? (
        <div className="pat-loading">
          <Loader2 size={32} className="pat-spin" />
          <p>Carregando pacientes...</p>
        </div>
      ) : filtrados.length === 0 ? (
        <div className="pat-empty">
          <Users size={48} color="#d1d5db" />
          <p>Nenhum paciente encontrado.</p>
        </div>
      ) : (
        <div className="pat-list">
          {filtrados.map((p) => (
            <div key={p.id} className="pat-row">
              <div className="pat-info">
                <strong>{p.nome}</strong>
                <span>ID {p.id} | {p.idade} anos</span>
              </div>
              <div className="pat-date">{formatarData(p.ultimaConsulta)}</div>
              <div className="pat-acoes">
                <button
                  className="pat-btn pat-btn-primary"
                  onClick={() => abrirProntuario(p.id)}
                >
                  Ver Prontuário
                </button>
                <button className="pat-btn pat-btn-outline">
                  Ver histórico completo
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Patients;
