import { api } from "./api";

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type ReceptionFeedValidation = {
  receptionist: {
    id: number;
    person_name: string;
    email: string;
    is_active: boolean;
    clinic_id: number;
    clinic_name: string;
  };
};

export type DailyAppointment = {
  id: number;
  patient_name: string;
  patient_id: number;
  time: string; // "08:00"
  specialty: string;
  arrival_status: "scheduled" | "late" | "in_office" | "in_progress" | "cancelled";
};

export type RegisterPatientData = {
  name: string;
  cpf: string;
  birth_date: string;
  gender: string;
  phone: string;
  is_minor: boolean;
  guardian_cpf?: string;
  guardian_name?: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
};

export type PatientByDocument = {
  id: number;
  patient_id: number;
  name: string;
  cpf: string;
};

export type ReceptionSpecialty = {
  id: number;
  name: string;
};

export type ReceptionDoctor = {
  id: number;
  name: string;
  specialty: string;
  clinic_name: string;
  clinical_access_id: number;
};

export type ReceptionSlot = {
  id: number;
  start_datetime: string;
  end_datetime: string;
  status: string;
};

export type ReceptionSlotDay = {
  date: string;
  label: string;
  slots: ReceptionSlot[];
};

export type ReceptionServiceCatalogItem = {
  name: string;
  specialty_id: number;
  min_price: number;
  max_price: number;
  clinics_count: number;
};

export type CreateReceptionAppointmentData = {
  patient_cpf: string;
  doctor_id: number;
  slot_id: number;
  service_id: number;
  clinical_access_id?: number;
  notes?: string;
};

// ─── Mock Data ───────────────────────────────────────────────────────────────
// Remova esta seção quando integrar com o backend real

const MOCK_DELAY = 400;
const mockDelay = () => new Promise((r) => setTimeout(r, MOCK_DELAY));

export const MOCK_DAILY_APPOINTMENTS: DailyAppointment[] = [
  { id: 1, patient_name: "Lucas Gama", patient_id: 10455, time: "08:00", specialty: "Cardiologia", arrival_status: "scheduled" },
  { id: 2, patient_name: "Maria Santos", patient_id: 11300, time: "08:00", specialty: "Ortopedia", arrival_status: "late" },
  { id: 3, patient_name: "João Pedro", patient_id: 12150, time: "08:00", specialty: "Dermatologia", arrival_status: "in_office" },
  { id: 4, patient_name: "Ana Carolina Lima", patient_id: 13400, time: "08:00", specialty: "Ortopedia", arrival_status: "in_progress" },
  { id: 5, patient_name: "Carlos Ferreira", patient_id: 14520, time: "10:00", specialty: "Pediatria", arrival_status: "scheduled" },
  { id: 6, patient_name: "Fernanda Oliveira", patient_id: 15800, time: "10:00", specialty: "Cardiologia", arrival_status: "scheduled" },
];

const MOCK_SPECIALTIES: ReceptionSpecialty[] = [
  { id: 1, name: "Clínica Geral" },
  { id: 2, name: "Cardiologia" },
  { id: 3, name: "Dermatologia" },
  { id: 4, name: "Pediatria" },
  { id: 5, name: "Ortopedia" },
];

const MOCK_SERVICES: ReceptionServiceCatalogItem[] = [
  { name: "Consulta de Rotina", specialty_id: 1, min_price: 120, max_price: 180, clinics_count: 1 },
  { name: "Triagem Geral", specialty_id: 1, min_price: 80, max_price: 80, clinics_count: 1 },
  { name: "Ecocardiograma", specialty_id: 2, min_price: 250, max_price: 350, clinics_count: 1 },
  { name: "Consulta Cardiológica", specialty_id: 2, min_price: 200, max_price: 250, clinics_count: 1 },
  { name: "Dermatoscopia", specialty_id: 3, min_price: 150, max_price: 200, clinics_count: 1 },
  { name: "Consulta Ginecológica", specialty_id: 4, min_price: 180, max_price: 220, clinics_count: 1 },
  { name: "Consulta Pediátrica", specialty_id: 5, min_price: 140, max_price: 160, clinics_count: 1 },
  { name: "Consulta Ortopédica", specialty_id: 6, min_price: 200, max_price: 280, clinics_count: 1 },
  { name: "Limpeza Dental", specialty_id: 7, min_price: 90, max_price: 120, clinics_count: 1 },
];

const MOCK_DOCTORS: ReceptionDoctor[] = [
  { id: 1, name: "Dr. Roberto Alves", specialty: "Clínica Geral", clinic_name: "Clínica Central", clinical_access_id: 101 },
  { id: 2, name: "Dra. Patrícia Costa", specialty: "Cardiologia", clinic_name: "Clínica Central", clinical_access_id: 102 },
  { id: 3, name: "Dr. Marcos Souza", specialty: "Dermatologia", clinic_name: "Clínica Central", clinical_access_id: 103 },
  { id: 4, name: "Dra. Juliana Mendes", specialty: "Ginecologia", clinic_name: "Clínica Central", clinical_access_id: 104 },
  { id: 5, name: "Dr. André Lima", specialty: "Pediatria", clinic_name: "Clínica Central", clinical_access_id: 105 },
];

const generateSlots = (doctorId: number): ReceptionSlotDay[] => {
  const today = new Date();
  const days: ReceptionSlotDay[] = [];
  const diasPt = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    const dateStr = d.toISOString().split("T")[0];
    const label = `${diasPt[d.getDay()]}, ${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
    const slots: ReceptionSlot[] = [];
    const horas = [8, 9, 10, 11, 14, 15, 16];
    horas.forEach((h, idx) => {
      if ((doctorId + idx) % 3 !== 0) {
        const start = new Date(d);
        start.setHours(h, 0, 0, 0);
        const end = new Date(start);
        end.setMinutes(end.getMinutes() + 50);
        slots.push({ id: doctorId * 1000 + i * 100 + idx, start_datetime: start.toISOString(), end_datetime: end.toISOString(), status: "available" });
      }
    });
    if (slots.length > 0) days.push({ date: dateStr, label, slots });
    if (days.length >= 5) break;
  }
  return days;
};

// ─── Funções de serviço (prontas para substituição por chamadas de API) ───────

export async function validateReceptionFeed(): Promise<ReceptionFeedValidation> {
  // TODO: substituir por → const response = await api.get("/reception/feed/validate"); return response.data;
  await mockDelay();
  return {
    receptionist: {
      id: 1,
      person_name: "Recepcionista Clinix",
      email: "recepcao@clinix.com",
      is_active: true,
      clinic_id: 1,
      clinic_name: "Clínica Central Clinix",
    },
  };
}

export async function getDailyFlow(): Promise<DailyAppointment[]> {
  // TODO: substituir por → const response = await api.get("/reception/daily-flow"); return response.data;
  await mockDelay();
  return MOCK_DAILY_APPOINTMENTS;
}

export async function checkInAppointment(appointmentId: number): Promise<void> {
  // TODO: substituir por → await api.patch(`/reception/appointments/${appointmentId}/checkin`);
  await mockDelay();
  console.log("Check-in realizado para appointment:", appointmentId);
}

export async function cancelReceptionAppointment(appointmentId: number): Promise<void> {
  // TODO: substituir por → await api.patch(`/reception/appointments/${appointmentId}/cancel`);
  await mockDelay();
  console.log("Cancelamento realizado para appointment:", appointmentId);
}

export async function registerPatient(data: RegisterPatientData): Promise<void> {
  // TODO: substituir por → await api.post("/reception/patients/register", data);
  await mockDelay();
  console.log("Paciente cadastrado:", data);
}

export async function findPatientByCpf(cpf: string): Promise<PatientByDocument> {
  // TODO: substituir por → const response = await api.get(`/reception/patients/cpf/${cpf}`); return response.data;
  await mockDelay();
  // Mock: encontra paciente se CPF tem 14 chars (formatado)
  if (cpf.length < 11) throw new Error("Paciente não encontrado");
  return {
    id: 99,
    patient_id: 99001,
    name: "Reynaldo Pereira",
    cpf,
  };
}

export async function listReceptionSpecialties(): Promise<ReceptionSpecialty[]> {
  // TODO: substituir por → const response = await api.get("/reception/specialties"); return response.data;
  await mockDelay();
  return MOCK_SPECIALTIES;
}

export async function listReceptionServicesBySpecialty(specialtyId: number): Promise<ReceptionServiceCatalogItem[]> {
  // TODO: substituir por → const response = await api.get(`/reception/specialties/${specialtyId}/services`); return response.data;
  await mockDelay();
  return MOCK_SERVICES.filter((s) => s.specialty_id === specialtyId);
}

export async function listReceptionDoctorsBySpecialtyAndService(
  specialtyId: number,
  serviceName: string
): Promise<ReceptionDoctor[]> {
  // TODO: substituir por → const response = await api.get(`/reception/specialties/${specialtyId}/doctors`, { params: { service_name: serviceName } }); return response.data;
  await mockDelay();
  const specialty = MOCK_SPECIALTIES.find((s) => s.id === specialtyId);
  return MOCK_DOCTORS.filter((d) => specialty && d.specialty.toLowerCase().includes(specialty.name.toLowerCase().split(" ")[0])) ?? MOCK_DOCTORS.slice(0, 2);
}

export async function listReceptionSlots(doctorId: number): Promise<ReceptionSlotDay[]> {
  // TODO: substituir por → const response = await api.get(`/reception/doctors/${doctorId}/slots`); return response.data;
  await mockDelay();
  return generateSlots(doctorId);
}

export async function createReceptionAppointment(data: CreateReceptionAppointmentData): Promise<void> {
  // TODO: substituir por → await api.post("/reception/appointments", data);
  await mockDelay();
  console.log("Agendamento criado pela recepção:", data);
}