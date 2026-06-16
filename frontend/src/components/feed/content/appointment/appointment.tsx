import React, { useState, useEffect } from 'react';
import {
  Search, Stethoscope, Heart, Sparkles, Venus, Baby, Bone, ChevronRight,
  ArrowLeft, MapPin, Star, Calendar, User, Clock, Loader2, Tag, Building2
} from 'lucide-react';
import './appointment.css';
import {
  listSpecialties,
  listServicesBySpecialty,
  listClinicsByService,
  listDoctorsByClinicAndService,
  listSlots,
  createAppointment,
  type Specialty,
  type ServiceCatalogItem,
  type ClinicWithService,
  type Doctor,
  type SlotDay,
} from '../../../../services/patientService';

// Mapeamento puramente visual (ícone por especialidade). Os dados reais
// (id, name) vêm sempre da API — isso aqui só decide qual ícone mostrar.
const iconesPorEspecialidade: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  'clínica geral': Stethoscope,
  'cardiologia': Heart,
  'dermatologia': Sparkles,
  'ginecologia': Venus,
  'pediatria': Baby,
  'ortopedia': Bone,
};

const getIconeEspecialidade = (nome: string) => iconesPorEspecialidade[nome.toLowerCase()] ?? Stethoscope;

const formatarPreco = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const Appointment = () => {
  const [etapa, setEtapa] = useState(0);
  const [buscaClinica, setBuscaClinica] = useState('');

  const [dataSelecionada, setDataSelecionada] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const [especialidades, setEspecialidades] = useState<Specialty[]>([]);
  const [servicos, setServicos] = useState<ServiceCatalogItem[]>([]);
  const [clinicas, setClinicas] = useState<ClinicWithService[]>([]);
  const [medicos, setMedicos] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<Record<number, SlotDay[]>>({});

  // Fluxo: especialidade > serviço > clínica > médico > horário
  const [especialidadeSelecionada, setEspecialidadeSelecionada] = useState<Specialty | null>(null);
  const [servicoSelecionado, setServicoSelecionado] = useState<ServiceCatalogItem | null>(null);
  // clinicaSelecionada já carrega o service_id e o preço específicos daquela clínica
  const [clinicaSelecionada, setClinicaSelecionada] = useState<ClinicWithService | null>(null);
  const [medicoSelecionado, setMedicoSelecionado] = useState<Doctor | null>(null);
  const [slotSelecionado, setSlotSelecionado] = useState<{ slotId: number; diaLabel: string; horario: string } | null>(null);

  useEffect(() => {
    if (etapa === 0) {
      setLoading(true);
      setErro(null);
      listSpecialties()
        .then(setEspecialidades)
        .catch(() => setErro('Não foi possível carregar as especialidades.'))
        .finally(() => setLoading(false));
    }
  }, [etapa]);

  useEffect(() => {
    if (etapa === 1 && especialidadeSelecionada) {
      setLoading(true);
      setErro(null);
      listServicesBySpecialty(especialidadeSelecionada.id)
        .then(setServicos)
        .catch(() => setErro('Não foi possível carregar os serviços.'))
        .finally(() => setLoading(false));
    }
  }, [etapa, especialidadeSelecionada]);

  useEffect(() => {
    if (etapa === 2 && especialidadeSelecionada && servicoSelecionado) {
      setLoading(true);
      setErro(null);
      listClinicsByService(especialidadeSelecionada.id, servicoSelecionado.name)
        .then(setClinicas)
        .catch(() => setErro('Não foi possível carregar as clínicas.'))
        .finally(() => setLoading(false));
    }
  }, [etapa, especialidadeSelecionada, servicoSelecionado]);

  useEffect(() => {
    if (etapa === 3 && clinicaSelecionada) {
      setLoading(true);
      setErro(null);
      listDoctorsByClinicAndService(clinicaSelecionada.id, clinicaSelecionada.service_id)
        .then(setMedicos)
        .catch(() => setErro('Não foi possível carregar os médicos.'))
        .finally(() => setLoading(false));
    }
  }, [etapa, clinicaSelecionada]);

  useEffect(() => {
    if (etapa === 3 && medicos.length > 0) {
      medicos.forEach((doc) => {
        if (!slots[doc.id]) {
          listSlots(doc.id).then((dias) => {
            setSlots((prev) => ({ ...prev, [doc.id]: dias }));
            if (!dataSelecionada && dias.length > 0) {
              setDataSelecionada(dias[0].date);
            }
          });
        }
      });
    }
  }, [medicos, etapa]);

  const selecionarEspecialidade = (especialidade: Specialty) => {
    setEspecialidadeSelecionada(especialidade);
    setServicos([]);
    setServicoSelecionado(null);
    setClinicas([]);
    setClinicaSelecionada(null);
    setMedicos([]);
    setSlots({});
    setDataSelecionada('');
    setEtapa(1);
  };

  const selecionarServico = (servico: ServiceCatalogItem) => {
    setServicoSelecionado(servico);
    setClinicas([]);
    setClinicaSelecionada(null);
    setMedicos([]);
    setSlots({});
    setDataSelecionada('');
    setBuscaClinica('');
    setEtapa(2);
  };

  const selecionarClinica = (clinica: ClinicWithService) => {
    setClinicaSelecionada(clinica);
    setMedicos([]);
    setSlots({});
    setDataSelecionada('');
    setEtapa(3);
  };

  const selecionarSlot = (medico: Doctor, diaLabel: string, slotId: number, horario: string) => {
    setMedicoSelecionado(medico);
    setSlotSelecionado({ slotId, diaLabel, horario });
    setEtapa(4);
  };

  const voltarEtapa = () => { if (etapa > 0) setEtapa(etapa - 1); };

  const confirmarAgendamento = async () => {
    if (!clinicaSelecionada || !medicoSelecionado || !slotSelecionado) return;
    setLoading(true);
    setErro(null);
    try {
      await createAppointment({
        clinic_id: clinicaSelecionada.id,
        doctor_id: medicoSelecionado.id,
        slot_id: slotSelecionado.slotId,
        // service_id vem da clínica selecionada: cada clínica tem seu próprio
        // registro de Service (mesmo nome, preço e id podem variar por clínica)
        service_id: clinicaSelecionada.service_id,
        clinical_access_id: medicoSelecionado.clinical_access_id,
      });
      setEtapa(5);
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
    setClinicaSelecionada(null);
    setMedicoSelecionado(null);
    setSlotSelecionado(null);
    setErro(null);
  };

  const renderHeader = (tituloEtapa: string, progresso: string) => (
    <div className="ac-header">
      {etapa > 0 && etapa < 5 && (
        <button onClick={voltarEtapa} className="ac-btn-voltar">
          <ArrowLeft size={20} style={{ marginRight: '8px' }} /> Voltar
        </button>
      )}
      <h1 className="ac-title">Agendar Nova Consulta</h1>
      <p className="ac-subtitle">{tituloEtapa}</p>
      <div className="ac-progress-track">
        <div className="ac-progress-fill" style={{ width: progresso }}></div>
      </div>
    </div>
  );

  const renderErro = () => erro && (
    <p style={{ color: '#dc2626', marginBottom: 16, fontWeight: 600 }}>{erro}</p>
  );

  const renderLoading = () => (
    <div className="ac-loading">
      <Loader2 size={32} className="ac-spin" />
      <p>Carregando...</p>
    </div>
  );

  // ETAPA 0: Especialidades
  if (etapa === 0) {
    return (
      <div className="ac-container">
        {renderHeader('Etapa 1 de 5: Especialidade', '20%')}
        <h2 className="ac-section-title">Especialidades Disponíveis</h2>
        {renderErro()}
        {loading ? renderLoading() : (
          <div className="ac-grid">
            {especialidades.length === 0 && !loading && (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>
                Nenhuma especialidade disponível no momento.
              </p>
            )}
            {especialidades.map((esp) => {
              const IconComponent = getIconeEspecialidade(esp.name);
              return (
                <button key={esp.id} className="ac-card" onClick={() => selecionarEspecialidade(esp)}>
                  <div className="ac-card-content">
                    <div className="ac-icon-container">
                      <IconComponent size={24} strokeWidth={1.5} />
                    </div>
                    <span className="ac-card-title">{esp.name}</span>
                  </div>
                  <ChevronRight className="ac-arrow-icon" size={20} />
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ETAPA 1: Serviços da especialidade escolhida
  if (etapa === 1) {
    return (
      <div className="ac-container">
        {renderHeader(`Etapa 2 de 5: Serviço — ${especialidadeSelecionada?.name ?? ''}`, '40%')}
        {renderErro()}
        <h2 className="ac-section-title">Serviços Disponíveis</h2>
        {loading ? renderLoading() : (
          <div className="ac-list-vertical">
            {servicos.length === 0 && !loading && (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>
                Nenhum serviço disponível para esta especialidade no momento.
              </p>
            )}
            {servicos.map((servico) => (
              <button key={servico.name} className="ac-card-clinica" onClick={() => selecionarServico(servico)}>
                <div className="ac-card-header-row">
                  <span className="ac-clinica-nome">{servico.name}</span>
                  <span className="ac-servico-preco">
                    <Tag size={14} />
                    {servico.min_price === servico.max_price
                      ? formatarPreco(servico.min_price)
                      : `${formatarPreco(servico.min_price)} – ${formatarPreco(servico.max_price)}`}
                  </span>
                </div>
                <span className="ac-clinica-endereco">
                  <Building2 size={16} />
                  Disponível em {servico.clinics_count} {servico.clinics_count === 1 ? 'clínica' : 'clínicas'}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ETAPA 2: Clínicas que oferecem o serviço escolhido
  if (etapa === 2) {
    const clinicasFiltradas = clinicas.filter(c =>
      c.trade_name.toLowerCase().includes(buscaClinica.toLowerCase()) ||
      c.address.toLowerCase().includes(buscaClinica.toLowerCase())
    );
    return (
      <div className="ac-container">
        {renderHeader(`Etapa 3 de 5: Clínica — ${servicoSelecionado?.name ?? ''}`, '60%')}
        {renderErro()}
        <div className="ac-search-container">
          <Search className="ac-search-icon" size={20} />
          <input
            type="text"
            className="ac-search-input"
            placeholder="Busque por clínica ou endereço..."
            value={buscaClinica}
            onChange={(e) => setBuscaClinica(e.target.value)}
          />
        </div>
        <h2 className="ac-section-title">Clínicas Disponíveis</h2>
        {loading ? renderLoading() : (
          <div className="ac-list-vertical">
            {clinicasFiltradas.length > 0 ? clinicasFiltradas.map((clinica) => (
              <button key={clinica.id} className="ac-card-clinica" onClick={() => selecionarClinica(clinica)}>
                <div className="ac-card-header-row">
                  <span className="ac-clinica-nome">{clinica.trade_name}</span>
                  <span className="ac-servico-preco">
                    <Tag size={14} /> {formatarPreco(clinica.price)}
                  </span>
                </div>
                <span className="ac-clinica-endereco"><MapPin size={16} /> {clinica.address}</span>
              </button>
            )) : (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>
                Nenhuma clínica encontrada para este serviço.
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // ETAPA 3: Médicos e Horários
  if (etapa === 3) {
    const formatarDiaSemana = (labelOriginal: string) => {
      if (!labelOriginal) return '';
      const traducoes: Record<string, string> = {
        'mon': 'Segunda', 'tue': 'Terça', 'wed': 'Quarta', 'thu': 'Quinta',
        'fri': 'Sexta', 'sat': 'Sábado', 'sun': 'Domingo',
        'monday': 'Segunda', 'tuesday': 'Terça', 'wednesday': 'Quarta',
        'thursday': 'Quinta', 'friday': 'Sexta', 'saturday': 'Sábado', 'sunday': 'Domingo'
      };
      const partes = labelOriginal.split(',');
      if (partes.length === 2) {
        const diaSemanaIngles = partes[0].trim().toLowerCase();
        const dataParte = partes[1].trim();
        const diaSemanaPt = traducoes[diaSemanaIngles] || partes[0].trim();
        return `${diaSemanaPt}, ${dataParte}`;
      }
      return labelOriginal;
    };

    return (
      <div className="ac-container">
        {renderHeader('Etapa 4 de 5: Médico e Horário', '80%')}
        {renderErro()}
        <h2 className="ac-section-title">
          Médicos Disponíveis — {servicoSelecionado?.name} em {clinicaSelecionada?.trade_name}
        </h2>
        {loading ? renderLoading() : (
          <div className="ac-list-vertical">
            {medicos.length === 0 && !loading && (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>
                Nenhum médico disponível para este serviço nesta clínica.
              </p>
            )}
            {medicos.map((medico) => {
              const diasMedico = slots[medico.id] ?? [];
              const datasDisponiveis = diasMedico.map(d => d.date);
              const minData = datasDisponiveis.length > 0 ? datasDisponiveis[0] : '';
              const maxData = datasDisponiveis.length > 0 ? datasDisponiveis[datasDisponiveis.length - 1] : '';
              const diaAtualMedico = diasMedico.find(d => d.date === dataSelecionada) || diasMedico[0];

              return (
                <div key={medico.id} className="ac-medico-card">
                  <div className="ac-medico-info">
                    <h3 className="ac-medico-nome">{medico.name}</h3>
                    <p className="ac-medico-esp">{medico.specialty}</p>
                    <p className="ac-medico-local"><MapPin size={14} /> {medico.clinic_name}</p>
                  </div>
                  <div className="ac-medico-agenda">
                    {diasMedico.length === 0 ? (
                      <p style={{ color: '#6b7280', fontSize: 14 }}>Sem horários disponíveis</p>
                    ) : (
                      <>
                        <div className="ac-calendario-container">
                          <label className="ac-calendario-label" htmlFor={`cal-${medico.id}`}>
                            <Calendar size={16} /> Selecione o Dia da Consulta:
                          </label>
                          <input
                            type="date"
                            id={`cal-${medico.id}`}
                            className="ac-calendario-input"
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

                        {diaAtualMedico && (
                          <div className="ac-horarios-wrap">
                            <p className="ac-agenda-titulo">
                              <Clock size={14} /> Horários disponíveis para {formatarDiaSemana(diaAtualMedico.label)}
                            </p>
                            <div className="ac-horarios-grid">
                              {diaAtualMedico.slots.map((slot) => {
                                const hora = new Date(slot.start_datetime).toLocaleTimeString('pt-BR', {
                                  hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo'
                                });
                                return (
                                  <span
                                    key={slot.id}
                                    className="ac-horario-badge"
                                    onClick={() => {
                                      const labelTraduzido = formatarDiaSemana(diaAtualMedico.label);
                                      selecionarSlot(medico, `${labelTraduzido}, às ${hora}`, slot.id, hora);
                                    }}
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

  // ETAPA 4: Confirmação
  if (etapa === 4) {
    return (
      <div className="ac-container">
        {renderHeader('Etapa 5 de 5: Confirmação', '100%')}
        {renderErro()}
        <h2 className="ac-section-title">Confirme os dados do agendamento</h2>
        <div className="ac-confirmacao-box">
          <div className="ac-conf-grid">
            <div className="ac-conf-item">
              <div className="ac-conf-header"><User size={18} /> Médico</div>
              <div className="ac-conf-medico">
                <div className="ac-avatar-placeholder"><User size={24} color="#6b7280" /></div>
                <div className="ac-conf-textos">
                  <p className="ac-texto-nome">{medicoSelecionado?.name}</p>
                  <p className="ac-texto-sub">{medicoSelecionado?.specialty}</p>
                </div>
              </div>
            </div>
            <div className="ac-conf-item">
              <div className="ac-conf-header"><Tag size={18} /> Serviço</div>
              <p className="ac-texto-destaque">
                {servicoSelecionado?.name}
                {clinicaSelecionada && <><br />{formatarPreco(clinicaSelecionada.price)}</>}
              </p>
            </div>
            <div className="ac-conf-item">
              <div className="ac-conf-header"><Calendar size={18} /> Data e Horário</div>
              <p className="ac-texto-destaque">{slotSelecionado?.diaLabel}</p>
            </div>
            <div className="ac-conf-item">
              <div className="ac-conf-header"><User size={18} /> Paciente</div>
              <p className="ac-texto-destaque">Você</p>
            </div>
            <div className="ac-conf-item">
              <div className="ac-conf-header"><MapPin size={18} /> Local</div>
              <p className="ac-texto-destaque">
                {clinicaSelecionada?.trade_name}<br />{clinicaSelecionada?.address}
              </p>
            </div>
          </div>
          <div className="ac-clinica-card">
            <div className="ac-clinica-foto">Clínica</div>
            <p className="ac-clinica-nome-card">{clinicaSelecionada?.trade_name}</p>
            <div className="ac-estrelas">
              {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="#eab308" color="#eab308" />)}
            </div>
          </div>
        </div>
        <div className="ac-botoes-finais">
          <button onClick={confirmarAgendamento} className="ac-btn-verde" disabled={loading}>
            {loading ? <Loader2 size={18} className="ac-spin" /> : 'Confirmar Agendamento'}
          </button>
          <button onClick={voltarEtapa} className="ac-btn-cinza" disabled={loading}>Voltar</button>
        </div>
      </div>
    );
  }

  // ETAPA 5: Sucesso
  return (
    <div className="ac-container ac-container-centralizado">
      <div className="ac-sucesso-box-notificacao">
        <div className="ac-icone-sucesso">
          <span style={{ color: 'white', fontSize: '32px', fontWeight: 'bold' }}>✓</span>
        </div>
        <h1 className="ac-title-sucesso">Agendamento Confirmado!</h1>
        <p className="ac-subtitle-sucesso">Sua consulta foi reservada com sucesso.</p>
        <button onClick={reiniciar} className="ac-btn-verde ac-btn-sucesso">
          Voltar ao Início
        </button>
      </div>
    </div>
  );
};

export default Appointment;