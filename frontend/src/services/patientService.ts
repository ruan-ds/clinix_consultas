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
  next_appointment: AppointmentHistoryItem | null;
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
  service_id: number; // antes era opcional e nem era enviado — agora obrigatório, igual ao schema do back
  clinical_access_id?: number;
  notes?: string;
};

export type AppointmentHistoryItem = {
  id: number;
  doctor_name: string;
  clinic_name: string;
  address: string;
  status: string;
  date: string;
  specialty: string;
  service_name?: string;
  price?: number;
};

export type HistoryAppointment = {
  id: number;
  doctor_name: string;
  clinic_name: string;
  address: string;
  location?: string;
  status: string;
  date: string;
  specialty: string;
  service_name?: string;
  price?: number;
};
export type Specialty = {
  id: number;
  name: string;
};

export type ServiceCatalogItem = {
  name: string;
  specialty_id: number;
  min_price: number;
  max_price: number;
  clinics_count: number;
};

export type ClinicWithService = {
  id: number;
  trade_name: string;
  address: string;
  service_id: number;
  price: number;
};
export type MyDoctor = {
  id: number;
  name: string;
  specialty: string;
  clinic: string;
  location: string;
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
export async function getActiveAppointments(): Promise<AppointmentHistoryItem[]> {
  const response = await api.get("/patient/appointments/active");
  return response.data;
}

export async function cancelAppointment(appointmentId: number): Promise<void> {
  await api.patch(`/patient/appointments/${appointmentId}/cancel`);
}
export async function listHistoryAppointments(): Promise<HistoryAppointment[]> {
  const response = await api.get("/patient/appointments/history");
  return response.data;
}
export async function listSpecialties(): Promise<Specialty[]> {
  const response = await api.get("/patient/specialties");
  return response.data;
}

export async function listServicesBySpecialty(specialtyId: number): Promise<ServiceCatalogItem[]> {
  const response = await api.get(`/patient/specialties/${specialtyId}/services`);
  return response.data;
}

export async function listClinicsByService(specialtyId: number, serviceName: string): Promise<ClinicWithService[]> {
  const response = await api.get(`/patient/specialties/${specialtyId}/clinics`, {
    params: { service_name: serviceName },
  });
  return response.data;
}

export async function listDoctorsByClinicAndService(clinicId: number, serviceId: number): Promise<Doctor[]> {
  const response = await api.get(`/patient/clinics/${clinicId}/services/${serviceId}/doctors`);
  return response.data;
}

export type PatientContact = {
  email: string;
  phone?: string | null;
};

export type UpdatePatientContactData = {
  email?: string;
  phone?: string;
};

export type UpdatePatientPasswordData = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

export async function getPatientContact(): Promise<PatientContact> {
  const response = await api.get("/patient/account/contact");
  return response.data;
}

export async function updatePatientContact(data: UpdatePatientContactData): Promise<void> {
  await api.put("/patient/account/contact", data);
}

export async function updatePatientPassword(data: UpdatePatientPasswordData): Promise<void> {
  await api.put("/patient/account/password", data);
}


export async function getMyDoctors(): Promise<MyDoctor[]> {
  const response = await api.get("/patient/my-doctors");
  return response.data;
}