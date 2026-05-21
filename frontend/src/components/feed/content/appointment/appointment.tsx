import React, { useState } from 'react';
import { 
  Search, Stethoscope, Heart, Sparkles, Venus, Baby, Bone, ChevronRight, 
  ArrowLeft, MapPin, Star, Calendar, User, Check 
} from 'lucide-react';
import './appointment.css';

// --- MOCK DATA (Dados Falsos) ---
const especialidadesMock = [
  { id: 'clinica-geral', nome: 'Clínica Geral', Icone: Stethoscope },
  { id: 'cardiologia', nome: 'Cardiologia', Icone: Heart },
  { id: 'dermatologia', nome: 'Dermatologia', Icone: Sparkles },
  { id: 'ginecologia', nome: 'Ginecologia', Icone: Venus },
  { id: 'pediatria', nome: 'Pediatria', Icone: Baby },
  { id: 'ortopedia', nome: 'Ortopedia', Icone: Bone },
];

const clinicasMock = [
  { id: 'clinica-1', nome: 'Clínica Pró Saúde', endereco: 'Av. Paulista, 1000' },
  { id: 'clinica-2', nome: 'Centro Médico Vida', endereco: 'Rua Augusta, 500' },
];

const medicosMock = [
  { id: 'med-1', nome: 'Dr. Marcos Paulo', especialidade: 'Cardiologista', avaliacao: '4.9/5 (120 avaliações)', clinica: 'Clínica Pró Saúde' },
  { id: 'med-2', nome: 'Dra. Ana Clara', especialidade: 'Cardiologista', avaliacao: '4.9/5 (120 avaliações)', clinica: 'Clínica Pró Saúde' },
];

export const Appointment = () => {
  // --- ESTADOS ---
  const [etapa, setEtapa] = useState(0); 
  const [agendamento, setAgendamento] = useState({
    especialidadeId: '',
    clinicaId: '',
    medicoId: '',
    horario: ''
  });
  const [buscaClinica, setBuscaClinica] = useState('');

  // --- FUNÇÕES DE NAVEGAÇÃO ---
  const selecionarEspecialidade = (id: string) => {
    setAgendamento({ ...agendamento, especialidadeId: id });
    setEtapa(1);
  };

  const selecionarClinica = (id: string) => {
    setAgendamento({ ...agendamento, clinicaId: id });
    setEtapa(2); 
  };

  const selecionarMedico = (id: string, horario: string) => {
    setAgendamento({ ...agendamento, medicoId: id, horario: horario });
    setEtapa(3); 
  };

  const voltarEtapa = () => {
    if (etapa > 0) setEtapa(etapa - 1);
  };

  const confirmarAgendamento = () => {
    console.log("Enviando para o banco de dados:", agendamento);
    setEtapa(4); // Vai para a tela de sucesso final
  };

  // --- CABEÇALHO REUTILIZÁVEL ---
  const renderHeader = (tituloEtapa: string, progresso: string) => (
    <div className="ac-header">
      {etapa > 0 && etapa < 4 && (
        <button onClick={voltarEtapa} className="ac-btn-voltar">
          <ArrowLeft size={20} style={{ marginRight: '8px' }} />
          Voltar
        </button>
      )}
      <h1 className="ac-title">Agendar Nova Consulta</h1>
      <p className="ac-subtitle">{tituloEtapa}</p>
      <div className="ac-progress-track">
        <div className="ac-progress-fill" style={{ width: progresso }}></div>
      </div>
    </div>
  );

  // --- RENDERIZAÇÃO DAS ETAPAS ---

  // ETAPA 0: Especialidades
  if (etapa === 0) {
    return (
      <div className="ac-container">
        {renderHeader("Etapa 1 de 4: Especialidade", "25%")}
        
        <div>
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
      </div>
    );
  }

  // ETAPA 1: Clínicas
// ETAPA 1 NO CÓDIGO (Mas visualmente é a Etapa 2 de 4: Selecionar Clínica)
  else if (etapa === 1) {
    const clinicasFiltradas = clinicasMock.filter(clinica => 
      clinica.nome.toLowerCase().includes(buscaClinica.toLowerCase()) || 
      clinica.endereco.toLowerCase().includes(buscaClinica.toLowerCase())
    );

    return (
      <div className="ac-container">
        {/* Mantendo o texto exato do seu print */}
        {renderHeader("Etapa 2 de 4: Selecionar Clínica", "50%")}
        
        <div>
          {/* BARRA DE PESQUISA (Entre o progresso e a lista) */}
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
          <div className="ac-list-vertical">
            {clinicasFiltradas.length > 0 ? (
              clinicasFiltradas.map((clinica) => (
                <button 
                  key={clinica.id} 
                  className="ac-card-clinica"
                  onClick={() => selecionarClinica(clinica.id)}
                >
                  <span className="ac-clinica-nome">{clinica.nome}</span>
                  <span className="ac-clinica-endereco">
                    <MapPin size={16} /> {clinica.endereco}
                  </span>
                </button>
              ))
            ) : (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px 0' }}>
                Nenhuma clínica encontrada.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // ETAPA 2: Médicos e Horários
  else if (etapa === 2) {
    // Pegando o nome da especialidade selecionada para o título
    const espSelecionada = especialidadesMock.find(e => e.id === agendamento.especialidadeId)?.nome;

    return (
      <div className="ac-container">
        {renderHeader("Etapa 3 de 4: Médico e Horário", "75%")}
        
        <div>
          <h2 className="ac-section-title">Médicos Disponíveis - {espSelecionada}</h2>
          <div className="ac-list-vertical">
            {medicosMock.map((medico) => (
              <div key={medico.id} className="ac-medico-card">
                <div className="ac-medico-info">
                  <h3 className="ac-medico-nome">{medico.nome}</h3>
                  <p className="ac-medico-esp">{medico.especialidade}</p>
                  <p className="ac-medico-local">
                    <MapPin size={14} /> {medico.clinica}
                  </p>
                </div>

                <div className="ac-medico-agenda">
                  <p className="ac-agenda-titulo">Amanhã:</p>
                  <div className="ac-horarios-grid">
                    <span className="ac-horario-badge" onClick={() => selecionarMedico(medico.id, 'Amanhã, 09:00')}>09:00</span>
                    <span className="ac-horario-badge" onClick={() => selecionarMedico(medico.id, 'Amanhã, 10:30')}>10:30</span>
                    <span className="ac-horario-badge" onClick={() => selecionarMedico(medico.id, 'Amanhã, 11:00')}>11:00</span>
                    <span className="ac-horario-badge" onClick={() => selecionarMedico(medico.id, 'Amanhã, 15:30')}>15:30</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ETAPA 4: Confirmação (Visual igual ao seu print)
// ETAPA 4: Confirmação (Visual IGUAL ao seu print)
  else if (etapa === 3) {
    const medico = medicosMock.find(m => m.id === agendamento.medicoId);
    const clinica = clinicasMock.find(c => c.id === agendamento.clinicaId);

    return (
      <div className="ac-container">
        {renderHeader("Etapa 4 de 4: Confirmação", "100%")}
        
        <div className="ac-step-content">
          <h2 className="ac-section-title">Confirme os dados do seu agendamento</h2>
          
          {/* A CAIXA GRANDE */}
          <div className="ac-confirmacao-box">
            
            {/* LADO ESQUERDO: GRID 2x2 */}
            <div className="ac-conf-grid">
              
              {/* Item 1: Médico */}
              <div className="ac-conf-item">
                <div className="ac-conf-header"><User size={18} /> Médico</div>
                <div className="ac-conf-medico">
                  <div className="ac-avatar-placeholder"><User size={24} color="#6b7280" /></div>
                  <div className="ac-conf-textos">
                    <p className="ac-texto-nome">{medico?.nome}</p>
                    <p className="ac-texto-sub">{medico?.especialidade}</p>
                  </div>
                </div>
              </div>

              {/* Item 2: Data e Horário */}
              <div className="ac-conf-item">
                <div className="ac-conf-header"><Calendar size={18} /> Data e Horário</div>
                <p className="ac-texto-destaque">{agendamento.horario}</p>
              </div>

              {/* Item 3: Paciente */}
              <div className="ac-conf-item">
                <div className="ac-conf-header"><User size={18} /> Paciente</div>
                <p className="ac-texto-destaque">Gabriel Furlan</p>
              </div>

              {/* Item 4: Local */}
              <div className="ac-conf-item">
                <div className="ac-conf-header"><MapPin size={18} /> Local</div>
                <p className="ac-texto-destaque">{clinica?.nome}<br/>{clinica?.endereco}</p>
              </div>

            </div>

            {/* LADO DIREITO: Card da Clínica */}
            <div className="ac-clinica-card">
              <div className="ac-clinica-foto">Clínica</div>
              <p className="ac-clinica-nome-card">{clinica?.nome}</p>
              <div className="ac-estrelas">
                <Star size={14} fill="#eab308" color="#eab308" />
                <Star size={14} fill="#eab308" color="#eab308" />
                <Star size={14} fill="#eab308" color="#eab308" />
                <Star size={14} fill="#eab308" color="#eab308" />
                <Star size={14} fill="#eab308" color="#eab308" />
              </div>
            </div>

          </div>

          {/* BOTÕES IGUAIS AO PRINT */}
          <div className="ac-botoes-finais">
            <button onClick={confirmarAgendamento} className="ac-btn-verde">
              Confirmar Agendamento
            </button>
            <button onClick={voltarEtapa} className="ac-btn-cinza">
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

// ETAPA 4: Tela de Sucesso (Estilo Notificação Centralizada)
  else {
    return (
        <div className="ac-container ac-container-centralizado">
            <div className="ac-sucesso-box-notificacao">
                <div className="ac-icone-sucesso">
                    <Check size={40} color="white" strokeWidth={4} />
                </div>
                <h1 className="ac-title-sucesso">Agendamento Confirmado!</h1>
                <p className="ac-subtitle-sucesso">Sua consulta foi reservada.</p>
                <button onClick={() => setEtapa(0)} className="ac-btn-verde ac-btn-sucesso">
                    Voltar ao Início
                </button>
            </div>
        </div>
    );
  }
}
  export default Appointment; 