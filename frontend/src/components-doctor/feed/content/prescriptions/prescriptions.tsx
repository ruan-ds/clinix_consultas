import React, { useEffect, useState } from 'react';
import './prescriptions.css';
import {
  getDoctorPrescriptions,
  type Prescription,
} from '../../../../services/doctorService';
import { Loader2, FileText, ChevronDown, X, Printer, Pill, Calendar, User } from 'lucide-react';

const ITEMS_PER_PAGE = 10;

interface PrescriptionsProps {
  setTelaAtiva: (id: number) => void;
}

function Prescriptions({ setTelaAtiva }: PrescriptionsProps) {
  const [prescricoes, setPrescricoes] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [busca, setBusca] = useState('');
  const [ordem, setOrdem] = useState<'recentes' | 'az'>('recentes');
  const [paginaAtual, setPaginaAtual] = useState(1);
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

  const totalPaginas = Math.max(1, Math.ceil(filtradas.length / ITEMS_PER_PAGE));
  const paginadas = filtradas.slice(
    (paginaAtual - 1) * ITEMS_PER_PAGE,
    paginaAtual * ITEMS_PER_PAGE
  );

  const formatarData = (dateStr: string) =>
    new Date(dateStr)
      .toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
      .toUpperCase()
      .replace('.', '');

  const formatarDataLonga = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).toUpperCase();

  const getPaginasVisiveis = () => {
    const paginas: (number | '...')[] = [];
    if (totalPaginas <= 5) {
      for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
    } else {
      paginas.push(1, 2, 3);
      if (paginaAtual > 4) paginas.push('...');
      if (paginaAtual > 3 && paginaAtual < totalPaginas - 1)
        paginas.push(paginaAtual);
      if (totalPaginas > 3) paginas.push('...', totalPaginas);
    }
    return [...new Set(paginas)];
  };

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
      <p><span class="label">Data:</span> ${formatarDataLonga(p.ultimaConsulta)}</p>
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

      {/* Modal Ver Prescrição */}
      {visualizar && (
        <div className="presc-modal-overlay" onClick={() => setVisualizar(null)}>
          <div className="presc-modal" onClick={(e) => e.stopPropagation()}>
            <button className="presc-modal-close" onClick={() => setVisualizar(null)}>
              <X size={20} />
            </button>

            <div className="presc-modal-header">
              <div className="presc-modal-avatar">
                <span>{visualizar.pacienteNome.charAt(0)}</span>
              </div>
              <div>
                <h2>{visualizar.pacienteNome}</h2>
                <p>ID {visualizar.pacienteId} · {visualizar.pacienteIdade} anos</p>
              </div>
            </div>

            <div className="presc-modal-section">
              <div className="presc-modal-section-title">
                <Calendar size={15} /> Data da Prescrição
              </div>
              <p className="presc-modal-text">{formatarDataLonga(visualizar.ultimaConsulta)}</p>
            </div>

            <div className="presc-modal-section">
              <div className="presc-modal-section-title">
                <Pill size={15} /> Medicamento
              </div>
              <p className="presc-modal-text">
                {visualizar.medicamento} {visualizar.dosagem}
              </p>
            </div>

            <div className="presc-modal-section">
              <div className="presc-modal-section-title">
                <FileText size={15} /> Posologia
              </div>
              <p className="presc-modal-text">{visualizar.posologia}</p>
            </div>

            <div className="presc-modal-section">
              <div className="presc-modal-section-title">
                <User size={15} /> Observações
              </div>
              <p className="presc-modal-text">{visualizar.observacoes}</p>
            </div>

            <button
              className="presc-modal-btn-print"
              onClick={() => handleImprimir(visualizar)}
            >
              <Printer size={15} /> Imprimir Prescrição
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="presc-header">
        <h2>Prescrições</h2>
      </header>

      {/* Controls */}
      <div className="presc-controls">
        <input
          type="text"
          placeholder="Buscar pacientes por nome, CPF ou ID..."
          value={busca}
          onChange={(e) => { setBusca(e.target.value); setPaginaAtual(1); }}
          className="presc-search"
        />
        <div className="presc-select-wrapper">
          <select
            className="presc-select"
            value={ordem}
            onChange={(e) => setOrdem(e.target.value as 'recentes' | 'az')}
          >
            <option value="recentes">Recentes</option>
            <option value="az">A–Z</option>
          </select>
          <ChevronDown size={16} className="presc-select-icon" />
        </div>
        <button className="presc-btn-criar" onClick={() => setTelaAtiva(3)}>Criar Prescrição</button>
      </div>

      {/* Table header */}
      <div className="presc-table-header">
        <span>Paciente info</span>
        <span>Data Prescrição</span>
        <span>Preview Prescrição</span>
        <span className="presc-col-acoes">Ações</span>
      </div>

      {/* Rows */}
      {loading ? (
        <div className="presc-loading">
          <Loader2 size={32} className="presc-spin" />
          <p>Carregando prescrições...</p>
        </div>
      ) : paginadas.length === 0 ? (
        <div className="presc-empty">
          <FileText size={48} color="#d1d5db" />
          <p>Nenhuma prescrição encontrada.</p>
        </div>
      ) : (
        <div className="presc-list">
          {paginadas.map((p) => (
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
                  className="presc-btn presc-btn-ver"
                  onClick={() => setVisualizar(p)}
                >
                  Ver
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Paginação */}
      {!loading && filtradas.length > 0 && (
        <div className="presc-pagination">
          <button
            className="presc-page-btn presc-page-text"
            onClick={() => setPaginaAtual((p) => Math.max(1, p - 1))}
            disabled={paginaAtual === 1}
          >
            Anterior
          </button>
          <span className="presc-page-separator">|</span>

          {getPaginasVisiveis().map((pg, idx) =>
            pg === '...' ? (
              <span key={`ellipsis-${idx}`} className="presc-page-ellipsis">...</span>
            ) : (
              <button
                key={pg}
                className={`presc-page-btn ${paginaAtual === pg ? 'presc-page-active' : ''}`}
                onClick={() => setPaginaAtual(pg as number)}
              >
                {pg}
              </button>
            )
          )}

          <span className="presc-page-separator">|</span>
          <button
            className="presc-page-btn presc-page-text"
            onClick={() => setPaginaAtual((p) => Math.min(totalPaginas, p + 1))}
            disabled={paginaAtual === totalPaginas}
          >
            Próximo
          </button>
        </div>
      )}
    </div>
  );
}

export default Prescriptions;
