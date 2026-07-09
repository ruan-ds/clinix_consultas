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
  active_doctors: 6,
  active_receptionists: 3,
  occupancy_rate: 72,
};

let MOCK_SERVICOS: Servico[] = [
  { id: "S001", nome: "Limpeza", especialidade: "Odontologia", preco: 150 },
  { id: "S002", nome: "Pré-Natal", especialidade: "Ginecologia", preco: 600 },
  { id: "S003", nome: "Tratamento de canal", especialidade: "Endodontia", preco: 750 },
  { id: "S004", nome: "Pressão alta", especialidade: "Cardiologia", preco: 250 },
  { id: "S005", nome: "Dor de cabeça", especialidade: "Neurologia", preco: 350 },
];

let MOCK_ESPECIALIDADES: Especialidade[] = [
  { id: "E001", nome: "Odontologia", qtdProfissionais: 2 },
  { id: "E002", nome: "Ginecologia", qtdProfissionais: 3 },
  { id: "E003", nome: "Endodontia", qtdProfissionais: 2 },
  { id: "E004", nome: "Cardiologia", qtdProfissionais: 4 },
  { id: "E005", nome: "Neurologia", qtdProfissionais: 1 },
];

let MOCK_MEDICOS: Funcionario[] = [
  { id: "F001", nome: "Carlos Mendes", especialidade: "Cardiologia", status: "Ativo", tipo: "medico" },
  { id: "F002", nome: "Maria Luiza Santos", especialidade: "Pediatria", status: "Ativo", tipo: "medico" },
  { id: "F003", nome: "João Pedro Alencar", especialidade: "Pediatria", status: "Ativo", tipo: "medico" },
  { id: "F004", nome: "Ana Carolina Silva", especialidade: "Fisioterapia", status: "Ativo", tipo: "medico" },
  { id: "F005", nome: "Pedro Lima Castro", especialidade: "Pediatria", status: "Ativo", tipo: "medico" },
  { id: "F006", nome: "Juliana Ferreira", especialidade: "Cardiologia", status: "Ativo", tipo: "medico" },
];

let MOCK_RECEPCIONISTAS: Funcionario[] = [
  { id: "R001", nome: "Fernanda Rocha", especialidade: "—", status: "Ativo", tipo: "recepcionista" },
  { id: "R002", nome: "Marcos Alves", especialidade: "—", status: "Ativo", tipo: "recepcionista" },
  { id: "R003", nome: "Tatiane Lima", especialidade: "—", status: "Inativo", tipo: "recepcionista" },
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
      person_name: "Administrador",
      clinic_name: "Clínica Odonto Pró",
      email: "admin@clinica.com",
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
