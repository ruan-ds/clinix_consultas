// ─── receptionService.ts ────────────────────────────────────────────
// Todos os serviços da área de Recepção (subdomain: recepcao.*)
// Cada função está pronta para receber dados reais do backend.
// Os mocks que existem são apenas temporários — basta trocar o corpo
// da função pelo fetch/axios correspondente quando o endpoint estiver pronto.
// ────────────────────────────────────────────────────────────────────
import { api } from './api';

// ─── Tipos ──────────────────────────────────────────────────────────

/** Status de chegada do paciente na fila do dia */
export type ArrivalStatus =
  | 'Aguardando na Fila'
  | 'Check-in Completo'
  | 'Agendamento Futuro'
  | 'Cancelado'
  | 'Atendido';

/** Um item da lista de fluxo do dia (tabela principal da recepção) */
export type DayFlowItem = {
  id: number;
  time: string;           // "08:00"
  patientName: string;
  patientId: string;      // "ID 10455"
  specialty: string;
  arrivalStatus: ArrivalStatus;
};

/** Paginação retornada junto com a lista de fluxo */
export type DayFlowPage = {
  items: DayFlowItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/** Dados do formulário de Cadastro Rápido de Paciente */
export type QuickRegisterData = {
  // Dados pessoais
  fullName: string;
  cpf: string;
  birthDate: string;      // "YYYY-MM-DD"
  gender: string;         // "Masculino" | "Feminino" | "Outro"
  phone: string;
  isMinor: boolean;
  guardianCpf?: string;
  guardianName?: string;
  // Endereço
  cep: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
};

/** Resposta ao cadastrar paciente */
export type QuickRegisterResponse = {
  patientId: number;
  message: string;
};

/** Validação da sessão da recepção (equivalente ao validateFeed do paciente) */
export type ReceptionValidation = {
  receptionist: {
    id: number;
    clinical_access_id: number;
    person_name: string;
    clinic_name: string;
  };
};

// ─── Funções ────────────────────────────────────────────────────────

/**
 * Valida a sessão da recepcionista e retorna dados básicos.
 * Equivalente ao validateFeed() do paciente.
 * TODO: endpoint → GET /api/reception/validate
 */
export async function validateReception(): Promise<ReceptionValidation> {
  const response = await api.get<ReceptionValidation>('/api/reception/validate');
  return response.data;
}

/**
 * Busca a lista de pacientes do dia com suporte a busca e paginação.
 * @param search - Texto de busca (nome, CPF ou ID do paciente)
 * @param page   - Número da página (começa em 1)
 * TODO: endpoint → GET /api/reception/day-flow?search=&page=
 */
export async function getDayFlow(
  search: string = '',
  page: number = 1
): Promise<DayFlowPage> {
  const response = await api.get<DayFlowPage>('/api/reception/day-flow', {
    params: { search, page },
  });
  return response.data;
}

/**
 * Faz o check-in de um paciente.
 * @param appointmentId - ID do agendamento
 * TODO: endpoint → POST /api/reception/check-in/:appointmentId
 */
export async function checkInPatient(appointmentId: number): Promise<void> {
  await api.post(`/api/reception/check-in/${appointmentId}`);
}

/**
 * Cancela um agendamento na recepção.
 * @param appointmentId - ID do agendamento
 * TODO: endpoint → POST /api/reception/cancel/:appointmentId
 */
export async function cancelAppointmentReception(
  appointmentId: number
): Promise<void> {
  await api.post(`/api/reception/cancel/${appointmentId}`);
}

/**
 * Registra um novo paciente pelo formulário de Cadastro Rápido.
 * TODO: endpoint → POST /api/reception/register-patient
 */
export async function quickRegisterPatient(
  data: QuickRegisterData
): Promise<QuickRegisterResponse> {
  const response = await api.post<QuickRegisterResponse>(
    '/api/reception/register-patient',
    data
  );
  return response.data;
}

/**
 * Busca o CEP e retorna os dados de endereço (ViaCEP ou backend próprio).
 * TODO: endpoint → GET /api/utils/cep/:cep
 *       ou chamada direta para https://viacep.com.br/ws/:cep/json/
 */
export type CepData = {
  street: string;
  complement: string;
  city: string;
  state: string;
};

export async function lookupCep(cep: string): Promise<CepData> {
  // Chamada direta ao ViaCEP enquanto o endpoint próprio não existe
  const raw = cep.replace(/\D/g, '');
  const res = await fetch(`https://viacep.com.br/ws/${raw}/json/`);
  const json = await res.json();
  if (json.erro) throw new Error('CEP não encontrado');
  return {
    street: json.logradouro ?? '',
    complement: json.complemento ?? '',
    city: json.localidade ?? '',
    state: json.uf ?? '',
  };
}
