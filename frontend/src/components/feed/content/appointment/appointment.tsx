import React, { useState, useEffect } from 'react';
import {
  Search, Stethoscope, Heart, Sparkles, Venus, Baby, Bone, ChevronRight,
  ArrowLeft, MapPin, Star, Calendar, User, Check, Clock, Loader2
} from 'lucide-react';
import './appointment.css';
import {
  listClinics,
  listDoctors,
  listSlots,
  createAppointment,
  type Clinic,
  type Doctor,
  type SlotDay,
} from '../../../../services/patientService';

const especialidadesMock = [
  { id: 'clinica-geral', nome: 'Clínica Geral', Icone: Stethoscope },
  { id: 'cardiologia', nome: 'Cardiologia', Icone: Heart },
  { id: 'dermatologia', nome: 'Dermatologia', Icone: Sparkles },
  { id: 'ginecologia', nome: 'Ginecologia', Icone: Venus },
  { id: 'pediatria', nome: 'Pediatria', Icone: Baby },
  { id: 'ortopedia', nome: 'Ortopedia', Icone: Bone },
];

export const Appointment = () => {
  const [etapa, setEtapa] = useState(0);
  const [buscaClinica, setBuscaClinica] = useState('');
  const [diaAtivo, setDiaAtivo] = useState(0);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Dados da API
  const [clinicas, setClinicas] = useState<Clinic[]>([]);
  const [medicos, setMedicos] = useState<Doctor[]>([]);
  const [slots, setSlots] = useState<Record<number, SlotDay[]>>({}); // doctor_id -> slots

  // Seleção atual
  const [especialidadeId, setEspecialidadeId] = useState('');
  const [clinicaSelecionada, setClinicaSelecionada] = useState<Clinic | null>(null);
  const [medicoSelecionado, setMedicoSelecionado] = useState<Doctor | null>(null);
  const [slotSelecionado, setSlotSelecionado] = useState<{ slotId: number; diaLabel: string; horario: string } | null>(null);

  // Carrega clínicas ao entrar na etapa 1
  useEffect(() => {
    if (etapa === 1) {
      setLoading(true);
      setErro(null);
      listClinics()
        .then(setClinicas)
        .catch(() => setErro('Não foi possível carregar as clínicas.'))
        .finally(() => setLoading(false));
    }
  }, [etapa]);

  // Carrega médicos ao entrar na etapa 2
  useEffect(() => {
    if (etapa === 2 && clinicaSelecionada) {
      setLoading(true);
      setErro(null);
      listDoctors(clinicaSelecionada.id)
        .then(setMedicos)
        .catch(() => setErro('Não foi possível carregar os médicos.'))
        .finally(() => setLoading(false));
    }
  }, [etapa, clinicaSelecionada]);

  // Carrega slots de cada médico ao entrar na etapa 2
  useEffect(() => {
    if (etapa === 2 && medicos.length > 0) {
      medicos.forEach((doc) => {
        if (!slots[doc.id]) {
          listSlots(doc.id).then((dias) => {
            setSlots((prev) => ({ ...prev, [doc.id]: dias }));
          });
        }
      });
    }
  }, [medicos, etapa]);

  const selecionarEspecialidade = (id: string) => {
    setEspecialidadeId(id);
    setEtapa(1);
  };

  const selecionarClinica = (clinica: Clinic) => {
    setClinicaSelecionada(clinica);
    setMedicos([]);
    setSlots({});
    setDiaAtivo(0);
    setEtapa(2);
  };

  const selecionarSlot = (medico: Doctor, diaLabel: string, slotId: number, horario: string) => {
    setMedicoSelecionado(medico);
    setSlotSelecionado({ slotId, diaLabel, horario });
    setEtapa(3);
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
    setDiaAtivo(0);
    setClinicaSelecionada(null);
    setMedicoSelecionado(null);
    setSlotSelecionado(null);
    setErro(null);
  };

  const renderHeader = (tituloEtapa: string, progresso: string) => (
    <div className="ac-header">
      {etapa > 0 && etapa < 4 && (
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
        {renderHeader('Etapa 1 de 4: Especialidade', '25%')}
        <h2 className="ac-section-title">Especialidades Populares</h2>
        <div className="ac-grid">
          {especialidadesMock.map((esp) => {
            const IconComponent = esp.Icone;
            return (
              <button key={esp.id} className="ac-card" onClick={() => selecionarEspecialidade(esp.id)}>
                <div className="ac-card-content">
                  <div className="ac-icon-container">
                    <IconComponent size={24} strokeWidth={1.5} />
                  </div>
                  <span className="ac-card-title">{esp.nome}</span>
                </div>
                <ChevronRight className="ac-arrow-icon" size={20} />
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ETAPA 1: Clínicas
  if (etapa === 1) {
    const clinicasFiltradas = clinicas.filter(c =>
      c.trade_name.toLowerCase().includes(buscaClinica.toLowerCase()) ||
      c.address.toLowerCase().includes(buscaClinica.toLowerCase())
    );
    return (
      <div className="ac-container">
        {renderHeader('Etapa 2 de 4: Selecionar Clínica', '50%')}
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
                <span className="ac-clinica-nome">{clinica.trade_name}</span>
                <span className="ac-clinica-endereco"><MapPin size={16} /> {clinica.address}</span>
              </button>
            )) : (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>
                Nenhuma clínica encontrada.
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // ETAPA 2: Médicos e Horários
  if (etapa === 2) {
    const espSelecionada = especialidadesMock.find(e => e.id === especialidadeId)?.nome;
    return (
      <div className="ac-container">
        {renderHeader('Etapa 3 de 4: Médico e Horário', '75%')}
        {renderErro()}
        <h2 className="ac-section-title">Médicos Disponíveis — {espSelecionada}</h2>
        {loading ? renderLoading() : (
          <div className="ac-list-vertical">
            {medicos.length === 0 && !loading && (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>
                Nenhum médico disponível nesta clínica.
              </p>
            )}
            {medicos.map((medico) => {
              const diasMedico = slots[medico.id] ?? [];
              const diaAtualMedico = diasMedico[diaAtivo] ?? diasMedico[0];
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
                        <div className="ac-dias-nav">
                          {diasMedico.map((dia, idx) => (
                            <button
                              key={idx}
                              className={`ac-dia-btn ${diaAtivo === idx ? 'ac-dia-btn--ativo' : ''}`}
                              onClick={() => setDiaAtivo(idx)}
                            >
                              <span className="ac-dia-label">{dia.label}</span>
                              <span className="ac-dia-data">{dia.date.slice(5).replace('-', '/')}</span>
                            </button>
                          ))}
                        </div>
                        {diaAtualMedico && (
                          <div className="ac-horarios-wrap">
                            <p className="ac-agenda-titulo">
                              <Clock size={14} /> Horários disponíveis
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
                                    onClick={() => selecionarSlot(medico, `${diaAtualMedico.label}, ${hora}`, slot.id, hora)}
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

  // ETAPA 3: Confirmação
  if (etapa === 3) {
    return (
      <div className="ac-container">
        {renderHeader('Etapa 4 de 4: Confirmação', '100%')}
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

  // ETAPA 4: Sucesso
  return (
    <div className="ac-container ac-container-centralizado">
      <div className="ac-sucesso-box-notificacao">
        <div className="ac-icone-sucesso">
          <Check size={40} color="white" strokeWidth={4} />
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