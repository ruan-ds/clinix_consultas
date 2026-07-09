import React, { useState, useEffect } from 'react';
import {
  Search, Stethoscope, Heart, Sparkles, Venus, Baby, Bone,
  ChevronRight, ArrowLeft, Calendar, User, Clock, Loader2, Tag,
} from 'lucide-react';
import './scheduling.css';
import {
  listReceptionSpecialties,
  listReceptionServicesBySpecialty,
  listReceptionDoctorsBySpecialtyAndService,
  listReceptionSlots,
  createReceptionAppointment,
  findPatientByCpf,
  type ReceptionSpecialty,
  type ReceptionServiceCatalogItem,
  type ReceptionDoctor,
  type ReceptionSlotDay,
  type PatientByDocument,
} from '../../../../services/receptionService';

const iconesPorEspecialidade: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  'clínica geral': Stethoscope,
  'cardiologia': Heart,
  'dermatologia': Sparkles,
  'ginecologia': Venus,
  'pediatria': Baby,
  'ortopedia': Bone,
};
const getIconeEspecialidade = (nome: string) => iconesPorEspecialidade[nome.toLowerCase()] ?? Stethoscope;
const formatarPreco = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatCpf = (v: string) =>
  v.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');

// ─── CPF Modal ────────────────────────────────────────────────────────────────
interface CpfModalProps {
  onConfirm: (paciente: PatientByDocument) => void;
}

const CpfModal = ({ onConfirm }: CpfModalProps) => {
  const [cpf, setCpf] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const handleConfirm = async () => {
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length < 11) {
      setErro('Informe um CPF válido.');
      return;
    }
    setLoading(true);
    setErro(null);
    try {
      const paciente = await findPatientByCpf(cpf);
      onConfirm(paciente);
    } catch {
      setErro('Paciente não encontrado. Verifique o CPF ou realize o Cadastro Rápido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ag-modal-overlay">
      <div className="ag-modal">
        <h2 className="ag-modal-title">CPF Paciente</h2>
        <input
          className="ag-modal-input"
          type="text"
          placeholder="000.000.000-00"
          value={cpf}
          onChange={(e) => { setCpf(formatCpf(e.target.value)); setErro(null); }}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          autoFocus
        />
        {erro && <p className="ag-modal-erro">{erro}</p>}
        <button className="ag-btn-verde ag-modal-btn" onClick={handleConfirm} disabled={loading}>
          {loading ? <Loader2 size={16} className="ag-spin" /> : 'Confirmar'}
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const Scheduling = () => {
  const [etapa, setEtapa] = useState(0);
  const [showCpfModal, setShowCpfModal] = useState(false);
  const [paciente, setPaciente] = useState<PatientByDocument | null>(null);
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [especialidades, setEspecialidades] = useState<ReceptionSpecialty[]>([]);
  const [servicos, setServicos] = useState<ReceptionServiceCatalogItem[]>([]);
  const [medicos, setMedicos] = useState<ReceptionDoctor[]>([]);
  const [slots, setSlots] = useState<Record<number, ReceptionSlotDay[]>>({});

  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<ReceptionSpecialty | null>(null);
  const [servicoSelecionado, setServicoSelecionado] = useState<ReceptionServiceCatalogItem | null>(null);
  const [medicoSelecionado, setMedicoSelecionado] = useState<ReceptionDoctor | null>(null);
  const [slotSelecionado, setSlotSelecionado] = useState<{ slotId: number; diaLabel: string; horario: string } | null>(null);

  // Etapa 0: especialidades
  useEffect(() => {
    if (etapa === 0) {
      setLoading(true);
      setErro(null);
      listReceptionSpecialties()
        .then(setEspecialidades)
        .catch(() => setErro('Não foi possível carregar as especialidades.'))
        .finally(() => setLoading(false));
    }
  }, [etapa]);

  // Etapa 1: serviços — mas antes mostra modal de CPF se paciente ainda não informado
  useEffect(() => {
    if (etapa === 1 && especialidadeSelecionada) {
      if (!paciente) {
        setShowCpfModal(true);
        return;
      }
      setLoading(true);
      setErro(null);
      listReceptionServicesBySpecialty(especialidadeSelecionada.id)
        .then(setServicos)
        .catch(() => setErro('Não foi possível carregar os serviços.'))
        .finally(() => setLoading(false));
    }
  }, [etapa, especialidadeSelecionada, paciente]);

  // Etapa 2: médicos
  useEffect(() => {
    if (etapa === 2 && especialidadeSelecionada && servicoSelecionado) {
      setLoading(true);
      setErro(null);
      listReceptionDoctorsBySpecialtyAndService(especialidadeSelecionada.id, servicoSelecionado.name)
        .then(setMedicos)
        .catch(() => setErro('Não foi possível carregar os médicos.'))
        .finally(() => setLoading(false));
    }
  }, [etapa, especialidadeSelecionada, servicoSelecionado]);

  useEffect(() => {
    if (etapa === 2 && medicos.length > 0) {
      medicos.forEach((doc) => {
        if (!slots[doc.id]) {
          listReceptionSlots(doc.id).then((dias) => {
            setSlots((prev) => ({ ...prev, [doc.id]: dias }));
            if (!dataSelecionada && dias.length > 0) setDataSelecionada(dias[0].date);
          });
        }
      });
    }
  }, [medicos, etapa]);

  const handleCpfConfirm = (p: PatientByDocument) => {
    setPaciente(p);
    setShowCpfModal(false);
    // Disparar load de serviços agora que temos o paciente
    setLoading(true);
    setErro(null);
    listReceptionServicesBySpecialty(especialidadeSelecionada!.id)
      .then(setServicos)
      .catch(() => setErro('Não foi possível carregar os serviços.'))
      .finally(() => setLoading(false));
  };

  const selecionarEspecialidade = (esp: ReceptionSpecialty) => {
    setEspecialidadeSelecionada(esp);
    setServicos([]);
    setServicoSelecionado(null);
    setMedicos([]);
    setSlots({});
    setDataSelecionada('');
    setEtapa(1);
  };

  const selecionarServico = (servico: ReceptionServiceCatalogItem) => {
    setServicoSelecionado(servico);
    setMedicos([]);
    setSlots({});
    setDataSelecionada('');
    setEtapa(2);
  };

  const selecionarSlot = (medico: ReceptionDoctor, diaLabel: string, slotId: number, horario: string) => {
    setMedicoSelecionado(medico);
    setSlotSelecionado({ slotId, diaLabel, horario });
    setEtapa(3);
  };

  const voltarEtapa = () => { if (etapa > 0) setEtapa(etapa - 1); };

  const confirmarAgendamento = async () => {
    if (!paciente || !medicoSelecionado || !slotSelecionado || !servicoSelecionado) return;
    setLoading(true);
    setErro(null);
    try {
      await createReceptionAppointment({
        patient_cpf: paciente.cpf,
        doctor_id: medicoSelecionado.id,
        slot_id: slotSelecionado.slotId,
        service_id: 1, // TODO: mapear service_id real quando backend pronto
        clinical_access_id: medicoSelecionado.clinical_access_id,
      });
      setEtapa(4);
    } catch {
      setErro('Não foi possível confirmar o agendamento. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const reiniciar = () => {
    setEtapa(0);
    setDataSelecionada('');
    setEspecialidadeSelecionada(null);
    setServicoSelecionado(null);
    setMedicoSelecionado(null);
    setSlotSelecionado(null);
    setPaciente(null);
    setErro(null);
  };

  const renderHeader = (tituloEtapa: string, progresso: string) => (
    <div className="ag-header">
      {etapa > 0 && etapa < 4 && (
        <button onClick={voltarEtapa} className="ag-btn-voltar">
          <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Voltar
        </button>
      )}
      <h1 className="ag-title">Agendar Nova Consulta</h1>
      <p className="ag-subtitle">{tituloEtapa}</p>
      {paciente && (
        <div className="ag-paciente-badge">
          <User size={14} /> Paciente: <strong>{paciente.name}</strong> — CPF: {paciente.cpf}
        </div>
      )}
      <div className="ag-progress-track">
        <div className="ag-progress-fill" style={{ width: progresso }}></div>
      </div>
    </div>
  );

  const renderErro = () => erro && <p className="ag-erro">{erro}</p>;
  const renderLoading = () => (
    <div className="ag-loading">
      <Loader2 size={32} className="ag-spin" />
      <p>Carregando...</p>
    </div>
  );

  // ─── ETAPA 0: Especialidades ───────────────────────────────────────────────
  if (etapa === 0) {
    return (
      <div className="ag-container">
        {renderHeader('Etapa 1 de 4: Especialidade', '25%')}
        <div className="ag-search-container">
          <Search className="ag-search-icon" size={20} />
          <input
            type="text"
            className="ag-search-input"
            placeholder="Busque por especialidade..."
            readOnly
          />
        </div>
        <h2 className="ag-section-title">Especialidades</h2>
        {renderErro()}
        {loading ? renderLoading() : (
          <div className="ag-grid">
            {especialidades.map((esp) => {
              const Icon = getIconeEspecialidade(esp.name);
              return (
                <button key={esp.id} className="ag-card" onClick={() => selecionarEspecialidade(esp)}>
                  <div className="ag-card-content">
                    <div className="ag-icon-container"><Icon size={24} strokeWidth={1.5} /></div>
                    <span className="ag-card-title">{esp.name}</span>
                  </div>
                  <ChevronRight className="ag-arrow-icon" size={20} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ─── ETAPA 1: Serviços + Modal CPF ────────────────────────────────────────
  if (etapa === 1) {
    return (
      <div className="ag-container">
        {showCpfModal && <CpfModal onConfirm={handleCpfConfirm} />}
        {renderHeader(`Etapa 2 de 4: Serviço — ${especialidadeSelecionada?.name ?? ''}`, '50%')}
        {renderErro()}
        <h2 className="ag-section-title">Serviços Disponíveis</h2>
        {loading ? renderLoading() : (
          <div className="ag-list-vertical">
            {servicos.map((s) => (
              <button key={s.name} className="ag-card-clinica" onClick={() => selecionarServico(s)}>
                <div className="ag-card-header-row">
                  <span className="ag-clinica-nome">{s.name}</span>
                  <span className="ag-servico-preco">
                    <Tag size={14} />
                    {s.min_price === s.max_price
                      ? formatarPreco(s.min_price)
                      : `${formatarPreco(s.min_price)} – ${formatarPreco(s.max_price)}`}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── ETAPA 2: Médicos e Horários ──────────────────────────────────────────
  if (etapa === 2) {
    const formatarDia = (labelOriginal: string) => {
      if (!labelOriginal) return '';
      const traducoes: Record<string, string> = {
        'mon': 'Segunda', 'tue': 'Terça', 'wed': 'Quarta', 'thu': 'Quinta',
        'fri': 'Sexta', 'sat': 'Sábado', 'sun': 'Domingo',
      };
      const partes = labelOriginal.split(',');
      if (partes.length === 2) {
        const key = partes[0].trim().toLowerCase();
        const pt = traducoes[key] || partes[0].trim();
        return `${pt}, ${partes[1].trim()}`;
      }
      return labelOriginal;
    };

    return (
      <div className="ag-container">
        {renderHeader('Etapa 3 de 4: Médico e Horário', '75%')}
        {renderErro()}
        <h2 className="ag-section-title">
          Médicos Disponíveis — {servicoSelecionado?.name}
        </h2>
        {loading ? renderLoading() : (
          <div className="ag-list-vertical">
            {medicos.length === 0 && !loading && (
              <p className="ag-empty">Nenhum médico disponível para este serviço.</p>
            )}
            {medicos.map((medico) => {
              const diasMedico = slots[medico.id] ?? [];
              const datasDisponiveis = diasMedico.map((d) => d.date);
              const minData = datasDisponiveis[0] || '';
              const maxData = datasDisponiveis[datasDisponiveis.length - 1] || '';
              const diaAtual = diasMedico.find((d) => d.date === dataSelecionada) || diasMedico[0];
              return (
                <div key={medico.id} className="ag-medico-card">
                  <div className="ag-medico-info">
                    <h3 className="ag-medico-nome">{medico.name}</h3>
                    <p className="ag-medico-esp">{medico.specialty}</p>
                  </div>
                  <div className="ag-medico-agenda">
                    {diasMedico.length === 0 ? (
                      <p style={{ color: '#6b7280', fontSize: 14 }}>Sem horários disponíveis</p>
                    ) : (
                      <>
                        <div className="ag-calendario-container">
                          <label className="ag-calendario-label" htmlFor={`cal-${medico.id}`}>
                            <Calendar size={16} /> Selecione o Dia:
                          </label>
                          <input
                            type="date"
                            id={`cal-${medico.id}`}
                            className="ag-calendario-input"
                            min={minData}
                            max={maxData}
                            value={dataSelecionada || minData}
                            onChange={(e) => {
                              const valor = e.target.value;
                              if (datasDisponiveis.includes(valor)) {
                                setDataSelecionada(valor);
                                setErro(null);
                              } else {
                                setErro('A data selecionada não possui horários com este médico.');
                              }
                            }}
                          />
                        </div>
                        {diaAtual && (
                          <div className="ag-horarios-wrap">
                            <p className="ag-agenda-titulo">
                              <Clock size={14} /> Horários para {formatarDia(diaAtual.label)}
                            </p>
                            <div className="ag-horarios-grid">
                              {diaAtual.slots.map((slot) => {
                                const hora = new Date(slot.start_datetime).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
                                });
                                return (
                                  <span
                                    key={slot.id}
                                    className="ag-horario-badge"
                                    onClick={() => selecionarSlot(medico, `${formatarDia(diaAtual.label)}, às ${hora}`, slot.id, hora)}
                                  >
                                    {hora}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ─── ETAPA 3: Confirmação ──────────────────────────────────────────────────
  if (etapa === 3) {
    return (
      <div className="ag-container">
        {renderHeader('Etapa 4 de 4: Confirmação', '100%')}
        {renderErro()}
        <h2 className="ag-section-title">Confirme os dados do agendamento</h2>
        <div className="ag-confirmacao-box">
          <div className="ag-conf-grid">
            <div className="ag-conf-item">
              <div className="ag-conf-header"><User size={18} /> Paciente</div>
              <p className="ag-texto-destaque">{paciente?.name}</p>
              <p className="ag-texto-sub">{paciente?.cpf}</p>
            </div>
            <div className="ag-conf-item">
              <div className="ag-conf-header"><User size={18} /> Médico</div>
              <p className="ag-texto-destaque">{medicoSelecionado?.name}</p>
              <p className="ag-texto-sub">{medicoSelecionado?.specialty}</p>
            </div>
            <div className="ag-conf-item">
              <div className="ag-conf-header"><Tag size={18} /> Serviço</div>
              <p className="ag-texto-destaque">{servicoSelecionado?.name}</p>
            </div>
            <div className="ag-conf-item">
              <div className="ag-conf-header"><Calendar size={18} /> Data e Horário</div>
              <p className="ag-texto-destaque">{slotSelecionado?.diaLabel}</p>
            </div>
          </div>
        </div>
        <div className="ag-botoes-finais">
          <button onClick={confirmarAgendamento} className="ag-btn-verde" disabled={loading}>
            {loading ? <Loader2 size={18} className="ag-spin" /> : 'Confirmar Agendamento'}
          </button>
          <button onClick={voltarEtapa} className="ag-btn-cinza" disabled={loading}>Voltar</button>
        </div>
      </div>
    );
  }

  // ─── ETAPA 4: Sucesso ──────────────────────────────────────────────────────
  return (
    <div className="ag-container ag-container-centralizado">
      <div className="ag-sucesso-box">
        <div className="ag-icone-sucesso">
          <span style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>✓</span>
        </div>
        <h1 className="ag-title-sucesso">Agendamento Confirmado!</h1>
        <p className="ag-subtitle-sucesso">A consulta foi reservada com sucesso.</p>
        <button onClick={reiniciar} className="ag-btn-verde ag-btn-sucesso">
          Novo Agendamento
        </button>
      </div>
    </div>
  );
};

export default Scheduling;
