import { api } from "./api";

// ─── Tipos existentes ───────────────────────────────────────────────
export type FeedValidation = {
  patient: {
    id: number;
    patient_id: number;
    email: string;
    is_active: boolean;
    person_name: string;
  };
  has_upcoming_appointments: boolean;
  next_appointment: object | null;
};

// ─── Tipos novos ────────────────────────────────────────────────────
export type Clinic = {
  id: number;
  trade_name: string;
  address: string;
};

export type Doctor = {
  id: number;
  name: string;
  specialty: string;
  clinic_name: string;
  clinical_access_id: number;
};

export type Slot = {
  id: number;
  start_datetime: string;
  end_datetime: string;
  status: string;
};

export type SlotDay = {
  date: string;   // "2026-06-09"
  label: string;  // "Amanhã" ou "seg, 09/06"
  slots: Slot[];
};

export type CreateAppointmentData = {
  clinic_id: number;
  doctor_id: number;
  slot_id: number;
  clinical_access_id?: number;
  service_id?: number;
  notes?: string;
};

// ─── Funções existentes ─────────────────────────────────────────────
export async function validateFeed(): Promise<FeedValidation> {
  const response = await api.get("/patient/feed/validate");
  return response.data;
}

// ─── Funções novas ──────────────────────────────────────────────────
export async function listClinics(): Promise<Clinic[]> {
  const response = await api.get("/patient/clinics");
  return response.data;
}

export async function listDoctors(clinicId: number): Promise<Doctor[]> {
  const response = await api.get(`/patient/clinics/${clinicId}/doctors`);
  return response.data;
}

export async function listSlots(doctorId: number): Promise<SlotDay[]> {
  const response = await api.get(`/patient/doctors/${doctorId}/slots`);
  return response.data;
}

export async function createAppointment(data: CreateAppointmentData): Promise<void> {
  await api.post("/patient/appointments", data);
}