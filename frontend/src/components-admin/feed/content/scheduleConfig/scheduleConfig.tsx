import React, { useEffect, useState } from 'react';
import './scheduleConfig.css';
import { Loader2, ChevronDown } from 'lucide-react';
import {
  listMedicosParaAgenda,
  salvarAgendaConfig,
  type Medico,
  type AgendaConfig,
} from '../../../../services/adminService';

const DIAS_SEMANA = ['Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira'];

function ScheduleConfig() {
  const [medicos, setMedicos] = useState<Medico[]>([]);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);

  const [buscaMedico, setBuscaMedico] = useState('');
  const [medicoSelecionado, setMedicoSelecionado] = useState<Medico | null>(null);

  const [diasAberto, setDiasAberto] = useState(false);
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);

  const [horarioInicio, setHorarioInicio] = useState('08:00');
  const [horarioFim, setHorarioFim] = useState('18:00');
  const [quantidadeDias, setQuantidadeDias] = useState(15);
  const [almocInicio, setAlmocInicio] = useState('12:00');
  const [almocFim, setAlmocFim] = useState('13:00');

  useEffect(() => {
    setLoading(true);
    listMedicosParaAgenda()
      .then(setMedicos)
      .finally(() => setLoading(false));
  }, []);

  const medicosFiltrados = medicos.filter((m) =>
    m.nome.toLowerCase().includes(buscaMedico.toLowerCase())
  );

  const toggleDia = (dia: string) => {
    setDiasSelecionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const handleSalvar = async () => {
    if (!medicoSelecionado) return;
    setSalvando(true);
    const config: AgendaConfig = {
      medicoId: medicoSelecionado.id,
      diasSemana: diasSelecionados,
      horarioInicio,
      horarioFim,
      quantidadeDias,
      almocInicio,
      almocFim,
    };
    await salvarAgendaConfig(config);
    setSalvando(false);
    alert('Agenda configurada com sucesso!');
  };

  const handleLimpar = () => {
    setBuscaMedico('');
    setMedicoSelecionado(null);
    setDiasSelecionados([]);
    setHorarioInicio('08:00');
    setHorarioFim('18:00');
    setQuantidadeDias(15);
    setAlmocInicio('12:00');
    setAlmocFim('13:00');
    setDiasAberto(false);
  };

  if (loading) {
    return (
      <div className="sc-loading">
        <Loader2 size={32} className="sc-spin" />
        <p>Carregando agenda...</p>
      </div>
    );
  }

  return (
    <div className="sc-container">
      <h1 className="sc-title">DEFINIÇÃO DE DISPONIBILIDADE E HORÁRIOS</h1>

      <div className="sc-card">
        <h2 className="sc-card-title">PARÂMETROS DA AGENDA</h2>

        <div className="sc-body">
          {/* Coluna esquerda */}
          <div className="sc-col-left">
            {/* Médico selecionado */}
            <div className="sc-medico-section">
              <h3 className="sc-sub-title">MÉDICO SELECIONADO</h3>
              <input
                className="sc-input"
                placeholder="pesquisar pessoa"
                value={buscaMedico}
                onChange={(e) => setBuscaMedico(e.target.value)}
              />
              <div className="sc-medico-list">
                {medicosFiltrados.map((m) => (
                  <label key={m.id} className="sc-medico-item">
                    <input
                      type="checkbox"
                      checked={medicoSelecionado?.id === m.id}
                      onChange={() => setMedicoSelecionado(medicoSelecionado?.id === m.id ? null : m)}
                    />
                    <span>{m.nome} - {m.especialidade}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dias da semana */}
            <div className="sc-dias-section">
              <h3 className="sc-sub-title">Dias da Semana</h3>
              <div className="sc-dias-dropdown-wrapper">
                <button
                  className="sc-dias-trigger"
                  onClick={() => setDiasAberto((v) => !v)}
                  type="button"
                >
                  <span>
                    {diasSelecionados.length === 0
                      ? 'selecionar'
                      : `${diasSelecionados.length} dia(s)`}
                  </span>
                  <ChevronDown size={16} className={`sc-chevron ${diasAberto ? 'sc-chevron--open' : ''}`} />
                </button>

                {diasAberto && (
                  <div className="sc-dias-list">
                    {DIAS_SEMANA.map((dia) => (
                      <label key={dia} className="sc-dia-item">
                        <input
                          type="checkbox"
                          checked={diasSelecionados.includes(dia)}
                          onChange={() => toggleDia(dia)}
                        />
                        <span>{dia}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Coluna direita */}
          <div className="sc-col-right">
            <div className="sc-field">
              <label className="sc-label">Horário de Início:</label>
              <input
                className="sc-input-time"
                type="time"
                value={horarioInicio}
                onChange={(e) => setHorarioInicio(e.target.value)}
              />
            </div>

            <div className="sc-field">
              <label className="sc-label">Horário de Fim:</label>
              <input
                className="sc-input-time"
                type="time"
                value={horarioFim}
                onChange={(e) => setHorarioFim(e.target.value)}
              />
            </div>

            <div className="sc-field">
              <label className="sc-label">Quantidade de Dias:</label>
              <input
                className="sc-input-time"
                type="number"
                min={1}
                max={365}
                value={quantidadeDias}
                onChange={(e) => setQuantidadeDias(Number(e.target.value))}
              />
            </div>

            <div className="sc-field">
              <label className="sc-label">Horário de Almoço</label>
              <div className="sc-almoco-row">
                <span className="sc-almoco-label">Início:</span>
                <input
                  className="sc-input-time sc-input-time--sm"
                  type="time"
                  value={almocInicio}
                  onChange={(e) => setAlmocInicio(e.target.value)}
                />
                <span className="sc-almoco-label">Fim:</span>
                <input
                  className="sc-input-time sc-input-time--sm"
                  type="time"
                  value={almocFim}
                  onChange={(e) => setAlmocFim(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="sc-footer">
        <button className="sc-btn sc-btn-salvar" onClick={handleSalvar} disabled={!medicoSelecionado || salvando}>
          {salvando ? <Loader2 size={16} className="sc-spin" /> : 'SALVAR'}
        </button>
        <button className="sc-btn sc-btn-limpar" onClick={handleLimpar}>
          LIMPAR
        </button>
      </div>
    </div>
  );
}

export default ScheduleConfig;
