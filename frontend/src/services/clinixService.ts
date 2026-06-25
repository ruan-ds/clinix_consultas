import { api } from "./api";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ClinixFeedValidation = {
  admin: {
    id: number;
    person_name: string;
    email: string;
    is_active: boolean;
  };
};

export type DashboardStats = {
  registrations_today: number;
  occupancy_rate: number; // 0-100
  avg_wait_time_minutes: number;
};

export type RecentAction = {
  id: number;
  datetime: string; // "12/06/2026 14:15"
  operator: string;
  action: string;
  clinic: string;
};

export type ClinicStatus = "active" | "inactive";

export type Clinic = {
  id: string; // "CL001"
  trade_name: string;
  legal_name: string;
  phone: string;
  cnpj: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  services: string;
  status: ClinicStatus;
};

export type NewClinicData = {
  trade_name: string;
  legal_name: string;
  phone: string;
  cnpj: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  services: string;
};

export type Person = {
  id: number;
  name: string;
};

export type AccessProfile = "admin" | "receptionist" | "doctor";

export type NewPersonData = {
  name: string;
  phone: string;
  gender: string;
  cpf: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
};

export type CreateClinicAccessData = {
  person_id: number;
  clinic_id: string;
  profile: AccessProfile;
};

export type CreateBpoAccessData = {
  person_id: number;
  email: string;
  password: string;
};

export type ClinicUser = {
  id: string; // "CL001"
  clinic_name: string;
  status: ClinicStatus;
};

export type ClinicForDeactivation = {
  id: string; // "U001"
  name: string;
  status: ClinicStatus;
};

export type ClinicAccessForDeactivation = {
  id: string; // "FU001"
  employee_name: string;
  cpf: string;
  clinic_name: string;
  role: string;
  status: ClinicStatus;
};

export type ClinixAccessForDeactivation = {
  id: string; // "U001"
  name: string;
  cpf: string;
  status: ClinicStatus;
};

export type UpdatePasswordData = {
  user_id: string;
  new_password: string;
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
// Remova esta seção quando integrar com o backend real

const MOCK_DELAY = 400;
const mockDelay = () => new Promise((r) => setTimeout(r, MOCK_DELAY));

const MOCK_DASHBOARD_STATS: DashboardStats = {
  registrations_today: 155,
  occupancy_rate: 68,
  avg_wait_time_minutes: 11,
};

const MOCK_RECENT_ACTIONS: RecentAction[] = [
  { id: 1, datetime: "12/06/2026 14:15", operator: "Carlos M.", action: "Conf. Agend.", clinic: "Clínica Odonto" },
  { id: 2, datetime: "11/06/2026 15:15", operator: "Juliana C.", action: "Val. Cad.", clinic: "Clínica Pediát." },
  { id: 3, datetime: "10/06/2026 16:15", operator: "Maria S.", action: "Res. Financ", clinic: "Clínica Geral" },
  { id: 4, datetime: "09/06/2026 17:15", operator: "João P.", action: "Conf. Agend.", clinic: "Clinica Odonto" },
  { id: 5, datetime: "08/06/2026 10:15", operator: "Patricia R.", action: "Cad. Ráp.", clinic: "Clínica Pediát." },
];

let MOCK_CLINICS: Clinic[] = [
  { id: "CL001", trade_name: "Clínica Odonto Pró", legal_name: "Odonto Pró Serviços Odontológicos LTDA", phone: "(31) 3333-1000", cnpj: "11.111.111/0001-11", street: "Rua da Bahia", number: "100", city: "BH", state: "MG", services: "Odont. Geral", status: "active" },
  { id: "CL002", trade_name: "Clínica Pediátrica Unida", legal_name: "Pediátrica Unida LTDA", phone: "(11) 3333-2000", cnpj: "22.222.222/0001-22", street: "Av. Paulista", number: "500", city: "SP", state: "SP", services: "Pediá. | Vacinas", status: "active" },
  { id: "CL003", trade_name: "Clínica Derma Center", legal_name: "Derma Center Estética LTDA", phone: "(21) 3333-3000", cnpj: "33.333.333/0001-33", street: "Rua do Ouvidor", number: "50", city: "RJ", state: "RJ", services: "Clínica Geral", status: "active" },
  { id: "CL004", trade_name: "Clínica Pró Saúde", legal_name: "Pró Saúde Dermatologia LTDA", phone: "(31) 3333-4000", cnpj: "44.444.444/0001-44", street: "Rua Augusto", number: "333", city: "Betim", state: "MG", services: "Dermatologia", status: "active" },
  { id: "CL005", trade_name: "Clínica Amor Saúde", legal_name: "Amor Saúde Estética LTDA", phone: "(27) 3333-5000", cnpj: "55.555.555/0001-55", street: "Av. Marcos", number: "1200", city: "Vitória", state: "ES", services: "Estética", status: "inactive" },
];

const MOCK_PERSONS: Person[] = [
  { id: 1, name: "João Silva" },
  { id: 2, name: "Maria Santos" },
  { id: 3, name: "Carlos Mendes" },
];

let MOCK_CLINIC_USERS: ClinicUser[] = [
  { id: "CL001", clinic_name: "Clínica Odonto Pró", status: "active" },
  { id: "CL002", clinic_name: "Clínica Pediátrica Unida", status: "active" },
  { id: "CL003", clinic_name: "Clínica Derma Center", status: "active" },
  { id: "CL004", clinic_name: "Clínica Pró Saúde", status: "active" },
  { id: "CL005", clinic_name: "Clínica Amor Saúde", status: "active" },
];

let MOCK_CLINICS_DEACTIVATION: ClinicForDeactivation[] = [
  { id: "U001", name: "Ruan Vinícius", status: "active" },
  { id: "U002", name: "Bernardo Policarpo", status: "active" },
  { id: "U003", name: "Lucas Gabriel", status: "active" },
  { id: "U004", name: "Gabriel Furlan", status: "active" },
  { id: "U005", name: "Pablo Felipe", status: "active" },
];

let MOCK_CLINIC_ACCESS_DEACTIVATION: ClinicAccessForDeactivation[] = [
  { id: "FU001", employee_name: "Dr. Silva", cpf: "087.836.076-09", clinic_name: "Clínica Odonto Pró", role: "Ginecologista", status: "active" },
  { id: "FU002", employee_name: "Dra. Alice", cpf: "647.457.026-12", clinic_name: "Clínica Pediátrica Unida", role: "Pediátrica", status: "active" },
  { id: "FU003", employee_name: "Dr. Wesley", cpf: "764.156.436-49", clinic_name: "Clínica Derma Center", role: "Veterinária", status: "active" },
  { id: "FU004", employee_name: "Dr.João", cpf: "721.483.036-12", clinic_name: "Clínica Pró Saúde", role: "Cardiologista", status: "active" },
  { id: "FU005", employee_name: "Dra. Lara", cpf: "736.125.136-64", clinic_name: "Clínica Amor Saúde", role: "Estéticista", status: "inactive" },
];

let MOCK_CLINIX_ACCESS_DEACTIVATION: ClinixAccessForDeactivation[] = [
  { id: "U001", name: "Ruan Vinícius", cpf: "241.357.467-05", status: "active" },
  { id: "U002", name: "Bernardo Policarpo", cpf: "735.320.236-01", status: "active" },
  { id: "U003", name: "Lucas Gabriel", cpf: "057.667.276-90", status: "active" },
  { id: "U004", name: "Gabriel Furlan", cpf: "701.794.086-58", status: "active" },
  { id: "U005", name: "Pablo Felipe", cpf: "478.492.046-38", status: "active" },
];

// ─── Funções de serviço (prontas para substituição por chamadas de API) ──────

export async function validateClinixFeed(): Promise<ClinixFeedValidation> {
  // TODO: substituir por → const response = await api.get("/clinix/feed/validate"); return response.data;
  await mockDelay();
  return {
    admin: {
      id: 1,
      person_name: "Administrador Clinix",
      email: "admin@clinix.com",
      is_active: true,
    },
  };
}

export async function getDashboardStats(): Promise<DashboardStats> {
  // TODO: substituir por → const response = await api.get("/clinix/dashboard/stats"); return response.data;
  await mockDelay();
  return MOCK_DASHBOARD_STATS;
}

export async function getRecentActions(): Promise<RecentAction[]> {
  // TODO: substituir por → const response = await api.get("/clinix/dashboard/recent-actions"); return response.data;
  await mockDelay();
  return MOCK_RECENT_ACTIONS;
}

export async function validateNewRegistration(): Promise<void> {
  // TODO: substituir por → await api.patch("/clinix/registrations/validate");
  await mockDelay();
  console.log("Cadastro validado.");
}

export async function listClinics(): Promise<Clinic[]> {
  // TODO: substituir por → const response = await api.get("/clinix/clinics"); return response.data;
  await mockDelay();
  return MOCK_CLINICS;
}

export async function createClinic(data: NewClinicData): Promise<Clinic> {
  // TODO: substituir por → const response = await api.post("/clinix/clinics", data); return response.data;
  await mockDelay();
  const newClinic: Clinic = {
    id: `CL${String(MOCK_CLINICS.length + 1).padStart(3, "0")}`,
    status: "active",
    ...data,
  };
  MOCK_CLINICS = [...MOCK_CLINICS, newClinic];
  return newClinic;
}

export async function searchPersons(query: string): Promise<Person[]> {
  // TODO: substituir por → const response = await api.get(`/clinix/persons?search=${query}`); return response.data;
  await mockDelay();
  return MOCK_PERSONS.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
}

export async function registerPerson(data: NewPersonData): Promise<Person> {
  // TODO: substituir por → const response = await api.post("/clinix/persons", data); return response.data;
  await mockDelay();
  const newPerson: Person = { id: MOCK_PERSONS.length + 1, name: data.name };
  MOCK_PERSONS.push(newPerson);
  return newPerson;
}

export async function createClinicAccess(data: CreateClinicAccessData): Promise<void> {
  // TODO: substituir por → await api.post("/clinix/access/clinic", data);
  await mockDelay();
  console.log("Acesso clínico vinculado:", data);
}

export async function createBpoAccess(data: CreateBpoAccessData): Promise<void> {
  // TODO: substituir por → await api.post("/clinix/access/bpo", data);
  await mockDelay();
  console.log("Acesso BPO vinculado:", data);
}

export async function listClinicUsers(): Promise<ClinicUser[]> {
  // TODO: substituir por → const response = await api.get("/clinix/access/clinic-users"); return response.data;
  await mockDelay();
  return MOCK_CLINIC_USERS;
}

export async function toggleClinicUserStatus(id: string): Promise<void> {
  // TODO: substituir por → await api.patch(`/clinix/access/clinic-users/${id}/toggle`);
  await mockDelay();
  MOCK_CLINIC_USERS = MOCK_CLINIC_USERS.map((u) =>
    u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u
  );
}

export async function listClinicsForDeactivation(): Promise<ClinicForDeactivation[]> {
  // TODO: substituir por → const response = await api.get("/clinix/master/clinics"); return response.data;
  await mockDelay();
  return MOCK_CLINICS_DEACTIVATION;
}

export async function toggleClinicStatus(id: string): Promise<void> {
  // TODO: substituir por → await api.patch(`/clinix/master/clinics/${id}/toggle`);
  await mockDelay();
  MOCK_CLINICS_DEACTIVATION = MOCK_CLINICS_DEACTIVATION.map((c) =>
    c.id === id ? { ...c, status: c.status === "active" ? "inactive" : "active" } : c
  );
}

export async function listClinicAccessForDeactivation(): Promise<ClinicAccessForDeactivation[]> {
  // TODO: substituir por → const response = await api.get("/clinix/master/clinic-access"); return response.data;
  await mockDelay();
  return MOCK_CLINIC_ACCESS_DEACTIVATION;
}

export async function toggleClinicAccessStatus(id: string): Promise<void> {
  // TODO: substituir por → await api.patch(`/clinix/master/clinic-access/${id}/toggle`);
  await mockDelay();
  MOCK_CLINIC_ACCESS_DEACTIVATION = MOCK_CLINIC_ACCESS_DEACTIVATION.map((a) =>
    a.id === id ? { ...a, status: a.status === "active" ? "inactive" : "active" } : a
  );
}

export async function listClinixAccessForDeactivation(): Promise<ClinixAccessForDeactivation[]> {
  // TODO: substituir por → const response = await api.get("/clinix/master/clinix-access"); return response.data;
  await mockDelay();
  return MOCK_CLINIX_ACCESS_DEACTIVATION;
}

export async function toggleClinixAccessStatus(id: string): Promise<void> {
  // TODO: substituir por → await api.patch(`/clinix/master/clinix-access/${id}/toggle`);
  await mockDelay();
  MOCK_CLINIX_ACCESS_DEACTIVATION = MOCK_CLINIX_ACCESS_DEACTIVATION.map((a) =>
    a.id === id ? { ...a, status: a.status === "active" ? "inactive" : "active" } : a
  );
}

export async function updateMasterPassword(data: UpdatePasswordData): Promise<void> {
  // TODO: substituir por → await api.patch("/clinix/master/password", data);
  await mockDelay();
  console.log("Senha atualizada para:", data.user_id);
}
