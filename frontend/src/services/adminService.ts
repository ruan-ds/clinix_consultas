import { api } from "./api";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type AdminFeedValidation = {
  admin: {
    id: number;
    person_name: string;
    clinic_name: string;
    email: string;
    is_active: boolean;
  };
};

export type DashboardAdminStats = {
  total_appointments_today: number;
  active_doctors: number;
  active_receptionists: number;
  occupancy_rate: number; // 0-100
};

export type Servico = {
  id: string;
  nome: string;
  especialidade: string;
  preco: number;
};

export type Especialidade = {
  id: string;
  nome: string;
  qtdProfissionais: number;
};

export type Funcionario = {
  id: string;
  nome: string;
  especialidade: string;
  status: "Ativo" | "Inativo";
  tipo: "medico" | "recepcionista";
};

export type NovoAcesso = {
  nome: string;
  email: string;
  senha: string;
  tipo: "medico" | "recepcionista";
  especialidade?: string;
};

export type AgendaConfig = {
  medicoId: string;
  diasSemana: string[];
  horarioInicio: string;
  horarioFim: string;
  quantidadeDias: number;
  almocInicio: string;
  almocFim: string;
};

export type Medico = {
  id: string;
  nome: string;
  especialidade: string;
};

export type NovoServico = {
  nome: string;
  especialidade: string;
  preco: number;
};

// ─── Mock Data ───────────────────────────────────────────────────────────────

const MOCK_DELAY = 400;
const mockDelay = () => new Promise((r) => setTimeout(r, MOCK_DELAY));

const MOCK_STATS: DashboardAdminStats = {
  total_appointments_today: 38,
  active_doctors: 8,
  active_receptionists: 1,
  occupancy_rate: 72,
};

// Especialidades, serviços, médicos e recepcionistas abaixo refletem
// exatamente o que o script `app/scripts/seed.py` cadastra para a
// Clínica Central (8 médicos em 7 especialidades + 1 recepcionista).
let MOCK_SERVICOS: Servico[] = [
  // Clínica Geral
  { id: "S001", nome: "Consulta Médica", especialidade: "Clínica Geral", preco: 150 },
  { id: "S002", nome: "Check-up Geral", especialidade: "Clínica Geral", preco: 350 },
  { id: "S003", nome: "Atestado Médico", especialidade: "Clínica Geral", preco: 50 },
  { id: "S004", nome: "Retorno", especialidade: "Clínica Geral", preco: 80 },
  // Cardiologia
  { id: "S005", nome: "Consulta Cardiológica", especialidade: "Cardiologia", preco: 250 },
  { id: "S006", nome: "MAPA 24h — Hipertensão Arterial Sistêmica", especialidade: "Cardiologia", preco: 380 },
  { id: "S007", nome: "Holter 24h — Monitoramento Elétrico do Coração", especialidade: "Cardiologia", preco: 420 },
  { id: "S008", nome: "Eletrocardiograma (ECG) de Repouso", especialidade: "Cardiologia", preco: 120 },
  { id: "S009", nome: "Ecocardiograma Transtorácico", especialidade: "Cardiologia", preco: 550 },
  { id: "S010", nome: "Teste Ergométrico (Esteira)", especialidade: "Cardiologia", preco: 480 },
  { id: "S011", nome: "Ecocardiograma com Doppler Colorido", especialidade: "Cardiologia", preco: 650 },
  // Dermatologia
  { id: "S012", nome: "Consulta Dermatológica", especialidade: "Dermatologia", preco: 220 },
  { id: "S013", nome: "Criocirurgia (lesões)", especialidade: "Dermatologia", preco: 180 },
  { id: "S014", nome: "Biópsia de Pele", especialidade: "Dermatologia", preco: 350 },
  { id: "S015", nome: "Dermatoscopia Digital", especialidade: "Dermatologia", preco: 280 },
  { id: "S016", nome: "Retorno", especialidade: "Dermatologia", preco: 80 },
  // Ortopedia
  { id: "S017", nome: "Consulta Ortopédica", especialidade: "Ortopedia", preco: 250 },
  { id: "S018", nome: "Infiltração Articular", especialidade: "Ortopedia", preco: 550 },
  { id: "S019", nome: "Exame de Função Articular", especialidade: "Ortopedia", preco: 300 },
  { id: "S020", nome: "Retorno", especialidade: "Ortopedia", preco: 80 },
  // Neurologia
  { id: "S021", nome: "Consulta Neurológica", especialidade: "Neurologia", preco: 300 },
  { id: "S022", nome: "Eletroencefalograma (EEG)", especialidade: "Neurologia", preco: 450 },
  { id: "S023", nome: "Acompanhamento de Enxaqueca", especialidade: "Neurologia", preco: 250 },
  { id: "S024", nome: "Exame Neuropsicológico", especialidade: "Neurologia", preco: 600 },
  { id: "S025", nome: "Retorno", especialidade: "Neurologia", preco: 100 },
  // Ginecologia
  { id: "S026", nome: "Consulta Ginecológica", especialidade: "Ginecologia", preco: 230 },
  { id: "S027", nome: "Papanicolau", especialidade: "Ginecologia", preco: 150 },
  { id: "S028", nome: "Colposcopia", especialidade: "Ginecologia", preco: 380 },
  { id: "S029", nome: "Ultrassom Transvaginal", especialidade: "Ginecologia", preco: 420 },
  { id: "S030", nome: "Ultrassom Mamário", especialidade: "Ginecologia", preco: 400 },
  { id: "S031", nome: "Retorno", especialidade: "Ginecologia", preco: 80 },
  // Endocrinologia
  { id: "S032", nome: "Consulta Endocrinológica", especialidade: "Endocrinologia", preco: 280 },
  { id: "S033", nome: "Acompanhamento de Diabetes", especialidade: "Endocrinologia", preco: 250 },
  { id: "S034", nome: "Avaliação de Tireoide", especialidade: "Endocrinologia", preco: 300 },
  { id: "S035", nome: "Dosagens Hormonais", especialidade: "Endocrinologia", preco: 350 },
  { id: "S036", nome: "Retorno", especialidade: "Endocrinologia", preco: 100 },
];

let MOCK_ESPECIALIDADES: Especialidade[] = [
  { id: "E001", nome: "Clínica Geral", qtdProfissionais: 1 },
  { id: "E002", nome: "Cardiologia", qtdProfissionais: 2 },
  { id: "E003", nome: "Dermatologia", qtdProfissionais: 1 },
  { id: "E004", nome: "Ortopedia", qtdProfissionais: 1 },
  { id: "E005", nome: "Neurologia", qtdProfissionais: 1 },
  { id: "E006", nome: "Ginecologia", qtdProfissionais: 1 },
  { id: "E007", nome: "Endocrinologia", qtdProfissionais: 1 },
];

let MOCK_MEDICOS: Funcionario[] = [
  { id: "F001", nome: "Dr. João Silva", especialidade: "Clínica Geral", status: "Ativo", tipo: "medico" },
  { id: "F002", nome: "Dra. Beatriz Cardoso", especialidade: "Cardiologia", status: "Ativo", tipo: "medico" },
  { id: "F003", nome: "Dr. Lucas Almeida", especialidade: "Cardiologia", status: "Ativo", tipo: "medico" },
  { id: "F004", nome: "Dra. Camila Santos", especialidade: "Dermatologia", status: "Ativo", tipo: "medico" },
  { id: "F005", nome: "Dr. Rafael Ortopedista", especialidade: "Ortopedia", status: "Ativo", tipo: "medico" },
  { id: "F006", nome: "Dr. Pedro Neuro", especialidade: "Neurologia", status: "Ativo", tipo: "medico" },
  { id: "F007", nome: "Dra. Renata Gineco", especialidade: "Ginecologia", status: "Ativo", tipo: "medico" },
  { id: "F008", nome: "Dr. Thiago Endocrino", especialidade: "Endocrinologia", status: "Ativo", tipo: "medico" },
];

let MOCK_RECEPCIONISTAS: Funcionario[] = [
  { id: "R001", nome: "Maria Recepção", especialidade: "—", status: "Ativo", tipo: "recepcionista" },
];

const MOCK_MEDICOS_LISTA: Medico[] = MOCK_MEDICOS.map((m) => ({
  id: m.id,
  nome: m.nome,
  especialidade: m.especialidade,
}));

// ─── Funções de serviço ──────────────────────────────────────────────────────

export async function validateAdminFeed(): Promise<AdminFeedValidation> {
  // TODO: substituir por → const response = await api.get("/admin/feed/validate"); return response.data;
  await mockDelay();
  return {
    admin: {
      id: 1,
      person_name: "Ruan Administrador",
      clinic_name: "Clínica Central",
      email: "admin.central@clinicateste.com",
      is_active: true,
    },
  };
}

export async function getAdminDashboardStats(): Promise<DashboardAdminStats> {
  // TODO: substituir por → const response = await api.get("/admin/dashboard/stats"); return response.data;
  await mockDelay();
  return MOCK_STATS;
}

export async function listServicos(): Promise<Servico[]> {
  // TODO: substituir por → const response = await api.get("/admin/services"); return response.data;
  await mockDelay();
  return MOCK_SERVICOS;
}

export async function updateServico(id: string, data: Partial<Servico>): Promise<void> {
  // TODO: substituir por → await api.patch(`/admin/services/${id}`, data);
  await mockDelay();
  MOCK_SERVICOS = MOCK_SERVICOS.map((s) => (s.id === id ? { ...s, ...data } : s));
}

export async function criarServico(data: NovoServico): Promise<Servico> {
  // TODO: substituir por → const response = await api.post("/admin/services", data); return response.data;
  await mockDelay();
  const novo: Servico = {
    id: `S${String(MOCK_SERVICOS.length + 1).padStart(3, "0")}`,
    nome: data.nome,
    especialidade: data.especialidade,
    preco: data.preco,
  };
  MOCK_SERVICOS = [...MOCK_SERVICOS, novo];

  // Se a especialidade informada ainda não existir na clínica, cadastra
  // automaticamente para manter a lista de especialidades consistente.
  const jaExiste = MOCK_ESPECIALIDADES.some(
    (e) => e.nome.toLowerCase() === data.especialidade.toLowerCase()
  );
  if (!jaExiste) {
    MOCK_ESPECIALIDADES = [
      ...MOCK_ESPECIALIDADES,
      { id: `E${String(MOCK_ESPECIALIDADES.length + 1).padStart(3, "0")}`, nome: data.especialidade, qtdProfissionais: 0 },
    ];
  }

  return novo;
}

export async function listEspecialidades(): Promise<Especialidade[]> {
  // TODO: substituir por → const response = await api.get("/admin/specialties"); return response.data;
  await mockDelay();
  return MOCK_ESPECIALIDADES;
}

export async function deleteEspecialidade(id: string): Promise<void> {
  // TODO: substituir por → await api.delete(`/admin/specialties/${id}`);
  await mockDelay();
  MOCK_ESPECIALIDADES = MOCK_ESPECIALIDADES.filter((e) => e.id !== id);
}

export async function listMedicos(): Promise<Funcionario[]> {
  // TODO: substituir por → const response = await api.get("/admin/staff/doctors"); return response.data;
  await mockDelay();
  return MOCK_MEDICOS;
}

export async function listRecepcionistas(): Promise<Funcionario[]> {
  // TODO: substituir por → const response = await api.get("/admin/staff/receptionists"); return response.data;
  await mockDelay();
  return MOCK_RECEPCIONISTAS;
}

export async function toggleFuncionarioStatus(id: string, tipo: "medico" | "recepcionista"): Promise<void> {
  // TODO: substituir por → await api.patch(`/admin/staff/${id}/toggle`);
  await mockDelay();
  if (tipo === "medico") {
    MOCK_MEDICOS = MOCK_MEDICOS.map((m) =>
      m.id === id ? { ...m, status: m.status === "Ativo" ? "Inativo" : "Ativo" } : m
    );
  } else {
    MOCK_RECEPCIONISTAS = MOCK_RECEPCIONISTAS.map((r) =>
      r.id === id ? { ...r, status: r.status === "Ativo" ? "Inativo" : "Ativo" } : r
    );
  }
}

export async function criarNovoAcesso(data: NovoAcesso): Promise<void> {
  // TODO: substituir por → await api.post("/admin/staff/create-access", data);
  await mockDelay();
  console.log("Novo acesso criado:", data);
}

export async function listMedicosParaAgenda(): Promise<Medico[]> {
  // TODO: substituir por → const response = await api.get("/admin/doctors"); return response.data;
  await mockDelay();
  return MOCK_MEDICOS_LISTA;
}

export async function salvarAgendaConfig(data: AgendaConfig): Promise<void> {
  // TODO: substituir por → await api.post("/admin/schedule/config", data);
  await mockDelay();
  console.log("Agenda configurada:", data);
}
