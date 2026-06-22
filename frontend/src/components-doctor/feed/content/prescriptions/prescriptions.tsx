import React, { useEffect, useState } from 'react';
import './prescriptions.css';
import {
  getDoctorPrescriptions,
  type Prescription,
} from '../../../../services/doctorService';
import { Loader2, FileText, Printer, Eye, X, ScanLine } from 'lucide-react';

function Prescriptions() {
  const [prescricoes, setPrescricoes] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [ordem, setOrdem] = useState<'recentes' | 'az'>('recentes');
  const [visualizar, setVisualizar] = useState<Prescription | null>(null);

  useEffect(() => {
    setLoading(true);
    getDoctorPrescriptions()
      .then(setPrescricoes)
      .finally(() => setLoading(false));
  }, []);

  const filtradas = prescricoes
    .filter(
      (p) =>
        p.pacienteNome.toLowerCase().includes(busca.toLowerCase()) ||
        p.medicamento.toLowerCase().includes(busca.toLowerCase()) ||
        String(p.pacienteId).includes(busca)
    )
    .sort((a, b) =>
      ordem === 'az'
        ? a.pacienteNome.localeCompare(b.pacienteNome)
        : new Date(b.ultimaConsulta).getTime() - new Date(a.ultimaConsulta).getTime()
    );

  const formatarData = (dateStr: string) =>
    new Date(dateStr)
      .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
      .toUpperCase()
      .replace('.', '');

  const handleImprimir = (p: Prescription) => {
    const janela = window.open('', '_blank');
    if (!janela) return;
    janela.document.write(`
      <html><head><title>Prescrição - ${p.pacienteNome}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #111; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        p { font-size: 14px; line-height: 1.7; }
        .label { font-weight: bold; }
        hr { margin: 20px 0; }
        .footer { margin-top: 80px; text-align: center; font-size: 12px; color: #666; }
      </style></head><body>
      <h1>CLINIX — Prescrição Médica</h1>
      <p><span class="label">Paciente:</span> ${p.pacienteNome} (${p.pacienteIdade} anos)</p>
      <p><span class="label">ID:</span> ${p.pacienteId}</p>
      <p><span class="label">Data:</span> ${formatarData(p.ultimaConsulta)}</p>
      <hr/>
      <p><span class="label">Medicamento:</span> ${p.medicamento} ${p.dosagem}</p>
      <p><span class="label">Posologia:</span> ${p.posologia}</p>
      <p><span class="label">Observações:</span> ${p.observacoes}</p>
      <div class="footer">Assinatura do Médico: _______________________</div>
      </body></html>
    `);
    janela.document.close();
    janela.print();
  };

  return (
    <div className="presc-container">
      {/* Modal visualizar */}
      {visualizar && (
        <div className="presc-modal-overlay" onClick={() => setVisualizar(null)}>
          <div className="presc-modal" onClick={(e) => e.stopPropagation()}>
            <button className="presc-modal-close" onClick={() => setVisualizar(null)}>
              <X size={20} />
            </button>
            <div className="presc-modal-logo">CLINIX — Prescrição Médica</div>
            <div className="presc-modal-row">
              <span className="presc-label">Paciente</span>
              <span>{visualizar.pacienteNome} ({visualizar.pacienteIdade} anos)</span>
            </div>
            <div className="presc-modal-row">
              <span className="presc-label">ID</span>
              <span>{visualizar.pacienteId}</span>
            </div>
            <div className="presc-modal-row">
              <span className="presc-label">Data</span>
              <span>{formatarData(visualizar.ultimaConsulta)}</span>
            </div>
            <hr className="presc-divider" />
            <div className="presc-modal-row">
              <span className="presc-label">Medicamento</span>
              <span>{visualizar.medicamento} {visualizar.dosagem}</span>
            </div>
            <div className="presc-modal-row">
              <span className="presc-label">Posologia</span>
              <span>{visualizar.posologia}</span>
            </div>
            <div className="presc-modal-row">
              <span className="presc-label">Observações</span>
              <span>{visualizar.observacoes}</span>
            </div>
            <button
              className="presc-btn-print-modal"
              onClick={() => handleImprimir(visualizar)}
            >
              <Printer size={16} /> Imprimir
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="presc-header">
        <h2>Prescrições</h2>
        <button className="presc-btn-scan">
          <ScanLine size={16} /> + Escanear Prescrição
        </button>
      </header>

      {/* Controls */}
      <div className="presc-controls">
        <input
          type="text"
          placeholder="Buscar pacientes por nome, CPF ou ID..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="presc-search"
        />
        <select
          className="presc-select"
          value={ordem}
          onChange={(e) => setOrdem(e.target.value as 'recentes' | 'az')}
        >
          <option value="recentes">Recentes</option>
          <option value="az">A–Z</option>
        </select>
      </div>

      {/* Table header */}
      <div className="presc-table-header">
        <span>Paciente info</span>
        <span>Última Consulta</span>
        <span>Medicamento / Dosagem</span>
        <span className="presc-col-acoes">Ações</span>
      </div>

      {/* Rows */}
      {loading ? (
        <div className="presc-loading">
          <Loader2 size={32} className="presc-spin" />
          <p>Carregando prescrições...</p>
        </div>
      ) : filtradas.length === 0 ? (
        <div className="presc-empty">
          <FileText size={48} color="#d1d5db" />
          <p>Nenhuma prescrição encontrada.</p>
        </div>
      ) : (
        <div className="presc-list">
          {filtradas.map((p) => (
            <div key={p.id} className="presc-row">
              <div className="presc-info">
                <strong>{p.pacienteNome}</strong>
                <span>ID {p.pacienteId} | {p.pacienteIdade} anos</span>
              </div>
              <div className="presc-date">{formatarData(p.ultimaConsulta)}</div>
              <div className="presc-med">
                {p.medicamento} {p.dosagem}
                <span className="presc-posologia">({p.posologia})</span>
              </div>
              <div className="presc-acoes">
                <button
                  className="presc-btn presc-btn-primary"
                  onClick={() => handleImprimir(p)}
                >
                  <Printer size={14} /> Imprimir
                </button>
                <button
                  className="presc-btn presc-btn-outline"
                  onClick={() => setVisualizar(p)}
                >
                  <Eye size={14} /> Ver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Prescriptions;
