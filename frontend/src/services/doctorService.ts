// ============================================================
// doctorService.ts
// Dados falsos (mock) para a área do médico.
// Substitua as funções por chamadas reais à API quando o
// back-end estiver pronto.
// ============================================================

export interface AgendaItem {
  id: number;
  hora: string;
  pacienteNome: string;
  pacienteIdade: number;
  motivo: string;
  especialidade: string;
  // Somente 3 estados possíveis:
  // - 'atrasado'       → paciente não chegou e o horário já passou (vermelho)
  // - 'no_consultorio' → paciente chegou e aguarda ser chamado (azul claro)
  // - 'em_atendimento' → paciente está sendo atendido agora (verde)
  filaStatus: 'atrasado' | 'no_consultorio' | 'em_atendimento';
  filaTempoMin: number;
}

export interface Patient {
  id: number;
  nome: string;
  cpf: string;
  idade: number;
  ultimaConsulta: string; // ISO date string
  prontuarioResumo: string;
  diagnosticos: string[];
  alergias: string[];
  medicamentos: string[];
}

export interface Prescription {
  id: number;
  pacienteId: number;
  pacienteNome: string;
  pacienteIdade: number;
  ultimaConsulta: string; // ISO date string
  medicamento: string;
  dosagem: string;
  posologia: string;
  observacoes: string;
}

// ─────────────────────────────────────────────
// AGENDA (Dashboard do médico)
// Persona: Dra. Beatriz Cardoso — CRM 22222-SP — Cardiologia — Clínica Central
// (mesma médica cadastrada pelo seed do backend: doctor.crm = "CRM22222-SP",
// clinic = "Clinica Central", schedule = "morning" → 09h-17h)
// Todos os atendimentos abaixo pertencem à sua agenda de Cardiologia.
// ─────────────────────────────────────────────
const AGENDA_MOCK: AgendaItem[] = [
  {
    id: 1,
    hora: '08:00',
    pacienteNome: 'Lucas Gama',
    pacienteIdade: 17,
    motivo: 'MAPA 24h — Hipertensao Arterial Sistemica',
    especialidade: 'Cardiologia',
    filaStatus: 'no_consultorio',
    filaTempoMin: 12,
  }
];

// ─────────────────────────────────────────────
// PACIENTES
// Todos acompanhados pela Dra. Beatriz Cardoso (Cardiologia — Clínica Central)
// ─────────────────────────────────────────────
const PATIENTS_MOCK: Patient[] = [
  {
    id: 10455,
    nome: 'Lucas Gama',
    cpf: '123.456.789-00',
    idade: 62,
    ultimaConsulta: '2026-07-13T08:00:00',
    prontuarioResumo: 'Paciente com hipertensão arterial sistêmica controlada. Nega alergias medicamentosas conhecidas.',
    diagnosticos: ['Hipertensão arterial sistêmica', 'Dislipidemia'],
    alergias: ['Nenhuma conhecida'],
    medicamentos: ['Losartana 50mg (1x ao dia)', 'Atorvastatina 20mg (1x ao dia)'],
  },
  {
    id: 11300,
    nome: 'Maria Luiza Santos',
    cpf: '234.567.890-11',
    idade: 65,
    ultimaConsulta: '2026-05-25T08:30:00',
    prontuarioResumo: 'Paciente pós-infarto agudo do miocárdio há 2 anos, insuficiência cardíaca compensada. Seguimento cardiológico trimestral.',
    diagnosticos: ['Insuficiência cardíaca compensada (ICFEr)', 'Pós-IAM'],
    alergias: ['Penicilina'],
    medicamentos: ['Furosemida 40mg (1x ao dia)', 'Carvedilol 25mg (2x ao dia)', 'AAS 100mg (1x ao dia)'],
  },
  {
    id: 12150,
    nome: 'João Pedro Alencar',
    cpf: '345.678.901-22',
    idade: 58,
    ultimaConsulta: '2026-05-25T09:15:00',
    prontuarioResumo: 'Doença arterial coronariana, episódio recente de angina instável com internação. Uso de dupla antiagregação plaquetária.',
    diagnosticos: ['Doença arterial coronariana', 'Angina instável'],
    alergias: ['Dipirona'],
    medicamentos: ['Clopidogrel 75mg (1x ao dia)', 'Atorvastatina 80mg (1x ao dia)', 'Isossorbida 20mg (2x ao dia)'],
  },
  {
    id: 13400,
    nome: 'Ana Carolina Silva',
    cpf: '456.789.012-33',
    idade: 54,
    ultimaConsulta: '2026-05-25T10:00:00',
    prontuarioResumo: 'Estenose mitral leve e fibrilação atrial paroxística. Anticoagulada, com controle de INR mensal.',
    diagnosticos: ['Estenose mitral leve', 'Fibrilação atrial paroxística'],
    alergias: ['Nenhuma conhecida'],
    medicamentos: ['Varfarina 5mg (1x ao dia)', 'Metoprolol 50mg (2x ao dia)'],
  },
  {
    id: 14890,
    nome: 'Pedro Lima Castro',
    cpf: '567.890.123-44',
    idade: 60,
    ultimaConsulta: '2026-05-25T11:00:00',
    prontuarioResumo: 'Doença arterial coronariana estável, pós-angioplastia com implante de stent. Em prevenção secundária.',
    diagnosticos: ['Doença arterial coronariana estável', 'Pós-angioplastia (stent)'],
    alergias: ['Anti-inflamatórios (AINE)'],
    medicamentos: ['AAS 100mg (1x ao dia)', 'Rosuvastatina 20mg (1x ao dia)'],
  },
  {
    id: 15020,
    nome: 'Juliana Costa Alves',
    cpf: '678.901.234-55',
    idade: 50,
    ultimaConsulta: '2026-05-25T11:30:00',
    prontuarioResumo: 'Paciente em investigação de arritmia cardíaca (extrassístoles frequentes), realizando Holter de 24h.',
    diagnosticos: ['Arritmia cardíaca em investigação', 'Extrassístoles ventriculares'],
    alergias: ['Nenhuma conhecida'],
    medicamentos: ['Bisoprolol 2,5mg (1x ao dia)'],
  },
];

// ─────────────────────────────────────────────
// PRESCRIÇÕES
// Emitidas pela Dra. Beatriz Cardoso (Cardiologia — Clínica Central)
// ─────────────────────────────────────────────
const PRESCRIPTIONS_MOCK: Prescription[] = [
  {
    id: 1,
    pacienteId: 10455,
    pacienteNome: 'Lucas Gama',
    pacienteIdade: 62,
    ultimaConsulta: '2026-07-13T08:00:00',
    medicamento: 'Losartana',
    dosagem: '50mg',
    posologia: '1x ao dia',
    observacoes: 'Monitorar pressão arterial semanalmente e retornar em 60 dias.',
  },
  {
    id: 2,
    pacienteId: 11300,
    pacienteNome: 'Maria Luiza Santos',
    pacienteIdade: 65,
    ultimaConsulta: '2026-05-25T08:30:00',
    medicamento: 'Carvedilol',
    dosagem: '25mg',
    posologia: '12/12h',
    observacoes: 'Atenção a sinais de descompensação (edema, dispneia aos esforços).',
  },
  {
    id: 3,
    pacienteId: 12150,
    pacienteNome: 'João Pedro Alencar',
    pacienteIdade: 58,
    ultimaConsulta: '2026-05-25T09:15:00',
    medicamento: 'Clopidogrel',
    dosagem: '75mg',
    posologia: '1x ao dia',
    observacoes: 'Não interromper sem orientação médica — risco de trombose de stent.',
  },
  {
    id: 4,
    pacienteId: 13400,
    pacienteNome: 'Ana Carolina Silva',
    pacienteIdade: 54,
    ultimaConsulta: '2026-05-25T10:00:00',
    medicamento: 'Varfarina',
    dosagem: '5mg',
    posologia: '1x ao dia',
    observacoes: 'Retorno para novo controle de INR em 30 dias.',
  },
  {
    id: 5,
    pacienteId: 14890,
    pacienteNome: 'Pedro Lima Castro',
    pacienteIdade: 60,
    ultimaConsulta: '2026-05-25T11:00:00',
    medicamento: 'Rosuvastatina',
    dosagem: '20mg',
    posologia: '1x ao dia (à noite)',
    observacoes: 'Reforçar dieta hipolipídica e atividade física regular.',
  },
  {
    id: 6,
    pacienteId: 15020,
    pacienteNome: 'Juliana Costa Alves',
    pacienteIdade: 50,
    ultimaConsulta: '2026-05-25T11:30:00',
    medicamento: 'Bisoprolol',
    dosagem: '2,5mg',
    posologia: '1x ao dia',
    observacoes: 'Reavaliar em 15 dias com resultado do Holter de 24h.',
  },
];

// ─────────────────────────────────────────────
// Funções de serviço (simula chamadas async)
// ─────────────────────────────────────────────
export async function getDoctorAgenda(data?: string): Promise<AgendaItem[]> {
  // Futuramente: return api.get(`/doctor/agenda?date=${data}`)
  return new Promise((resolve) => setTimeout(() => resolve(AGENDA_MOCK), 400));
}

export async function getDoctorPatients(query?: string): Promise<Patient[]> {
  // Futuramente: return api.get(`/doctor/patients?q=${query}`)
  return new Promise((resolve) =>
    setTimeout(() => {
      if (!query) return resolve(PATIENTS_MOCK);
      const q = query.toLowerCase();
      resolve(
        PATIENTS_MOCK.filter(
          (p) =>
            p.nome.toLowerCase().includes(q) ||
            p.cpf.includes(q) ||
            String(p.id).includes(q)
        )
      );
    }, 300)
  );
}

export async function getPatientById(id: number): Promise<Patient | null> {
  return new Promise((resolve) =>
    setTimeout(() => resolve(PATIENTS_MOCK.find((p) => p.id === id) ?? null), 200)
  );
}

export async function getDoctorPrescriptions(query?: string): Promise<Prescription[]> {
  // Futuramente: return api.get(`/doctor/prescriptions?q=${query}`)
  return new Promise((resolve) =>
    setTimeout(() => {
      if (!query) return resolve(PRESCRIPTIONS_MOCK);
      const q = query.toLowerCase();
      resolve(
        PRESCRIPTIONS_MOCK.filter(
          (p) =>
            p.pacienteNome.toLowerCase().includes(q) ||
            p.medicamento.toLowerCase().includes(q) ||
            String(p.pacienteId).includes(q)
        )
      );
    }, 300)
  );
}

export async function iniciarAtendimento(id: number): Promise<void> {
  // Futuramente: return api.post(`/doctor/agenda/${id}/start`)
  return new Promise((resolve) => setTimeout(resolve, 200));
}

export async function encerrarAtendimento(id: number): Promise<void> {
  // Futuramente: return api.post(`/doctor/agenda/${id}/end`)
  return new Promise((resolve) => setTimeout(resolve, 200));
}
