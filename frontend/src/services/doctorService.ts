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
  filaStatus: 'no_consultorio' | 'em_triagem' | 'urgencia' | 'ausente' | 'aguardando';
  filaTempoMin: number;
  estadoClinico: 'Normal' | 'Acompanhamento' | 'Prioridade' | 'Atrasado';
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
// ─────────────────────────────────────────────
const AGENDA_MOCK: AgendaItem[] = [
  {
    id: 1,
    hora: '08:00',
    pacienteNome: 'Carlos Mendes',
    pacienteIdade: 42,
    motivo: 'Check-up Anual',
    especialidade: 'Clínica Geral',
    filaStatus: 'no_consultorio',
    filaTempoMin: 12,
    estadoClinico: 'Normal',
  },
  {
    id: 2,
    hora: '08:30',
    pacienteNome: 'Maria Luiza Santos',
    pacienteIdade: 65,
    motivo: 'Retorno (P.A.)',
    especialidade: 'Cardiologia',
    filaStatus: 'em_triagem',
    filaTempoMin: 8,
    estadoClinico: 'Acompanhamento',
  },
  {
    id: 3,
    hora: '09:15',
    pacienteNome: 'João Pedro Alencar',
    pacienteIdade: 10,
    motivo: 'Consulta Aguda',
    especialidade: 'Pediatria',
    filaStatus: 'urgencia',
    filaTempoMin: 0,
    estadoClinico: 'Prioridade',
  },
  {
    id: 4,
    hora: '10:00',
    pacienteNome: 'Ana Carolina Silva',
    pacienteIdade: 28,
    motivo: 'Telemedicina (Pré-Natal)',
    especialidade: 'Ginecologia',
    filaStatus: 'ausente',
    filaTempoMin: 0,
    estadoClinico: 'Atrasado',
  },
  {
    id: 5,
    hora: '11:00',
    pacienteNome: 'Pedro Lima Castro',
    pacienteIdade: 55,
    motivo: 'Consulta Preventiva',
    especialidade: 'Clínica Geral',
    filaStatus: 'aguardando',
    filaTempoMin: 10,
    estadoClinico: 'Normal',
  },
  {
    id: 6,
    hora: '11:30',
    pacienteNome: 'Juliana Costa Alves',
    pacienteIdade: 33,
    motivo: 'Dermatologia',
    especialidade: 'Dermatologia',
    filaStatus: 'aguardando',
    filaTempoMin: 5,
    estadoClinico: 'Normal',
  },
];

// ─────────────────────────────────────────────
// PACIENTES
// ─────────────────────────────────────────────
const PATIENTS_MOCK: Patient[] = [
  {
    id: 10455,
    nome: 'Joaquim S. de Moraes',
    cpf: '123.456.789-00',
    idade: 55,
    ultimaConsulta: '2026-05-25T10:00:00',
    prontuarioResumo: 'Paciente com hipertensão arterial controlada. Nega alergias medicamentosas conhecidas.',
    diagnosticos: ['Hipertensão arterial sistêmica', 'Dislipidemia'],
    alergias: ['Nenhuma conhecida'],
    medicamentos: ['Losartana 50mg (1x ao dia)', 'Atorvastatina 20mg (1x ao dia)'],
  },
  {
    id: 11300,
    nome: 'Maria Santos',
    cpf: '234.567.890-11',
    idade: 65,
    ultimaConsulta: '2026-05-25T14:30:00',
    prontuarioResumo: 'Paciente idosa, diabética tipo 2, faz uso regular de insulina. Seguimento cardiológico semestral.',
    diagnosticos: ['Diabetes Mellitus Tipo 2', 'Insuficiência cardíaca compensada'],
    alergias: ['Penicilina'],
    medicamentos: ['Insulina NPH (2x ao dia)', 'Metformina 850mg (2x ao dia)', 'Furosemida 40mg (1x ao dia)'],
  },
  {
    id: 12150,
    nome: 'João Pedro',
    cpf: '345.678.901-22',
    idade: 10,
    ultimaConsulta: '2026-05-25T08:00:00',
    prontuarioResumo: 'Criança com histórico de asma leve intermitente. Vacinação em dia.',
    diagnosticos: ['Asma leve intermitente', 'Rinite alérgica'],
    alergias: ['Dipirona'],
    medicamentos: ['Salbutamol spray (se necessário)', 'Loratadina 5mg (1x ao dia)'],
  },
  {
    id: 13400,
    nome: 'Ana Carolina Lima',
    cpf: '456.789.012-33',
    idade: 28,
    ultimaConsulta: '2026-05-25T16:00:00',
    prontuarioResumo: 'Paciente em pré-natal de baixo risco, IG 20 semanas. Nega comorbidades.',
    diagnosticos: ['Gestação (20 semanas)', 'Anemia ferropriva leve'],
    alergias: ['Nenhuma conhecida'],
    medicamentos: ['Sulfato ferroso 40mg (1x ao dia)', 'Ácido fólico 5mg (1x ao dia)'],
  },
  {
    id: 14890,
    nome: 'Roberto Figueiredo',
    cpf: '567.890.123-44',
    idade: 47,
    ultimaConsulta: '2026-04-10T11:00:00',
    prontuarioResumo: 'Paciente com dor lombar crônica. Realiza fisioterapia semanal.',
    diagnosticos: ['Lombalgia crônica', 'Hérnia de disco L4-L5'],
    alergias: ['Anti-inflamatórios (AINE)'],
    medicamentos: ['Paracetamol 750mg (se dor)', 'Ciclobenzaprina 5mg (à noite)'],
  },
];

// ─────────────────────────────────────────────
// PRESCRIÇÕES
// ─────────────────────────────────────────────
const PRESCRIPTIONS_MOCK: Prescription[] = [
  {
    id: 1,
    pacienteId: 10455,
    pacienteNome: 'Joaquim S. de Moraes',
    pacienteIdade: 55,
    ultimaConsulta: '2026-05-25T10:00:00',
    medicamento: 'Amoxicilina',
    dosagem: '500mg',
    posologia: '8/8h por 7 dias',
    observacoes: 'Tomar com alimento para evitar irritação gástrica.',
  },
  {
    id: 2,
    pacienteId: 11300,
    pacienteNome: 'Maria Santos',
    pacienteIdade: 65,
    ultimaConsulta: '2026-05-05T14:30:00',
    medicamento: 'Losartana',
    dosagem: '50mg',
    posologia: '1x ao dia',
    observacoes: 'Monitorar pressão arterial semanalmente.',
  },
  {
    id: 3,
    pacienteId: 12150,
    pacienteNome: 'João Pedro',
    pacienteIdade: 10,
    ultimaConsulta: '2026-04-22T08:00:00',
    medicamento: 'Paracetamol',
    dosagem: '750mg',
    posologia: 'se dor (máximo 4x ao dia)',
    observacoes: 'Não exceder 4g/dia. Retornar se febre persistir.',
  },
  {
    id: 4,
    pacienteId: 13400,
    pacienteNome: 'Ana Carolina Lima',
    pacienteIdade: 28,
    ultimaConsulta: '2026-04-12T16:00:00',
    medicamento: 'Amoxicilina',
    dosagem: '500mg',
    posologia: '8/8h por 5 dias',
    observacoes: 'Infecção urinária gestacional – seguir uso completo.',
  },
  {
    id: 5,
    pacienteId: 14890,
    pacienteNome: 'Roberto Figueiredo',
    pacienteIdade: 47,
    ultimaConsulta: '2026-04-10T11:00:00',
    medicamento: 'Ciclobenzaprina',
    dosagem: '5mg',
    posologia: '1x ao dia (à noite)',
    observacoes: 'Pode causar sonolência. Não dirigir após uso.',
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
