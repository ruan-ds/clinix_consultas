import React, { useState, useEffect } from 'react';
import './doctor-dashboard.css';

// 1. Tipagem exata do que o Backend deve enviar
interface PatientAppointment {
  id: string;
  time: string;
  patientName: string;
  reason: string;
  status: {
    color: 'green' | 'red' | 'yellow';
    mainText: string;
    subText: string;
  };
  action: {
    label: string;
    isDisabled: boolean;
  };
}

interface DoctorSchedule {
  doctorName: string;
  currentDate: string;
  appointments: PatientAppointment[];
}

export const DoctorDashboard = () => {
  const [schedule, setSchedule] = useState<DoctorSchedule | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Simulação de chamada de API (Pronto para ser trocado por um fetch/axios)
  useEffect(() => {
    const fetchSchedule = async () => {
      // Mock de dados baseado no seu layout
      const mockData: DoctorSchedule = {
        doctorName: "DR.SILVA",
        currentDate: "Segunda-feira, 26 de Outubro de 2026",
        appointments: [
          { id: '1', time: '08:00', patientName: 'Carlos Mendes', reason: 'Check-up Anual', status: { color: 'green', mainText: 'No Consultório', subText: 'Há 12 min *Normal*' }, action: { label: 'EncerrarAtendimento', isDisabled: false } },
          { id: '2', time: '08:30', patientName: 'Maria Luiza Santos', reason: 'Retorno (P.A.)', status: { color: 'green', mainText: 'Em Triagem Há 8 min', subText: '*Acompanhamento*' }, action: { label: 'IniciarAtendimento', isDisabled: true } },
          { id: '3', time: '09:15', patientName: 'João Pedro Alencar', reason: 'Consulta Aguda', status: { color: 'red', mainText: 'Urgência Detectada', subText: '*Prioridade*' }, action: { label: 'IniciarAtendimento', isDisabled: false } },
          { id: '4', time: '10:00', patientName: 'Ana Carolina Silva', reason: 'Telemedicina\n(Pré-Natal)', status: { color: 'red', mainText: 'Paciente Ausente', subText: '*Atrasado*' }, action: { label: 'IniciarAtendimento', isDisabled: true } },
          { id: '5', time: '11:00', patientName: 'Pedro Lima Castro', reason: 'Consulta Preventiva', status: { color: 'yellow', mainText: 'Aguardando na Recepção', subText: 'Há 10 min *Normal*' }, action: { label: 'IniciarAtendimento', isDisabled: false } },
          { id: '6', time: '12:00', patientName: 'Juliana Costa Silva', reason: 'Check-up Anual', status: { color: 'yellow', mainText: 'Aguardando na Recepção', subText: 'Há 1 min *Normal*' }, action: { label: 'IniciarAtendimento', isDisabled: false } },
        ]
      };

      // Simulando um delay de rede de 500ms
      setTimeout(() => {
        setSchedule(mockData);
        setIsLoading(false);
      }, 500);
    };

    fetchSchedule();
  }, []);

  // 3. Função preparada para enviar a ação do botão para a API
  const handleActionClick = (appointmentId: string, actionLabel: string) => {
    console.log(`Disparando ação: ${actionLabel} para o paciente ID: ${appointmentId}`);
    // Aqui entrará o POST para o backend: axios.post('/api/atendimento/iniciar', { id: appointmentId })
  };

  // Renderizador condicional das bolinhas de status
  const getStatusDotClass = (color: string) => {
    switch (color) {
      case 'green': return 'status-dot dot-green';
      case 'red': return 'status-dot dot-red';
      case 'yellow': return 'status-dot dot-yellow';
      default: return 'status-dot';
    }
  };

  // Função para renderizar textos em itálico com base nos asteriscos (ex: *Normal*)
  const formatSubText = (text: string) => {
    const parts = text.split(/\*(.*?)\*/g);
    return parts.map((part, i) => (i % 2 === 1 ? <i key={i}>{part}</i> : part));
  };

  if (isLoading || !schedule) {
    return <div className="loading-state">Carregando agenda...</div>;
  }

  return (
    <div className="medic-dashboard-container">
      
      {/* Cabeçalho */}
      <div className="medic-header">
        <h1 className="medic-title">{schedule.doctorName} - SUA AGENDA DE HOJE</h1>
        <div className="medic-date-pill">{schedule.currentDate}</div>
      </div>

      {/* Tabela de Consultas */}
      <div className="medic-table-container">
        <table className="medic-table">
          <thead>
            <tr>
              <th style={{ width: '8%' }}>Hora</th>
              <th style={{ width: '25%' }}>Paciente (Nome | Idade)</th>
              <th style={{ width: '22%' }}>Motivo / Especialidade</th>
              <th style={{ width: '25%' }}>Fila & Estado Clínico</th>
              <th style={{ width: '20%', textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {schedule.appointments.map((appt) => (
              <tr key={appt.id}>
                <td className="col-time">{appt.time}</td>
                <td className="col-name">{appt.patientName}</td>
                <td className="col-reason">
                  {appt.reason.split('\n').map((line, idx) => (
                    <span key={idx} style={{ display: 'block' }}>{line}</span>
                  ))}
                </td>
                <td className="col-status">
                  <div className="status-wrapper">
                    <span className={getStatusDotClass(appt.status.color)}></span>
                    <div className="status-texts">
                      <p className="status-main">{appt.status.mainText}</p>
                      <p className="status-sub">{formatSubText(appt.status.subText)}</p>
                    </div>
                  </div>
                </td>
                <td className="col-action">
                  <button 
                    className={`action-btn ${appt.action.isDisabled ? 'btn-disabled' : 'btn-active'}`}
                    disabled={appt.action.isDisabled}
                    onClick={() => handleActionClick(appt.id, appt.action.label)}
                  >
                    <span className="play-icon">▶</span> {appt.action.label}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};