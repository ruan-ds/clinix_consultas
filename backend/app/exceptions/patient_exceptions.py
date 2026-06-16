from fastapi import HTTPException
from app.exceptions.auth_exceptions import business_error 



def patient_not_found_or_inactive() -> None:
    business_error(
        code="PATIENT_NOT_FOUND_OR_INACTIVE",
        message="Paciente não encontrado ou inativo",
        status_code=404
    )

def email_already_in_use() -> None:
    business_error(
        code="EMAIL_ALREADY_IN_USE",
        field="email",
        message="E-mail já em uso",
        status_code=400
    )

def account_update_error() -> None:
    business_error(
        code="ACCOUNT_UPDATE_ERROR",
        message="Erro ao atualizar configurações de conta",
        status_code=400
    )

def passwords_do_not_match() -> None:
    business_error(
        code="PASSWORDS_DO_NOT_MATCH",
        message="A nova senha e a confirmação não coincidem",
        status_code=400
    )

def incorrect_current_password() -> None:
    business_error(
        code="INCORRECT_CURRENT_PASSWORD",
        message="Senha atual incorreta",
        status_code=401
    )

def invalid_appointment_time() -> None:
    business_error(
        code="INVALID_APPOINTMENT_TIME",
        message="Horário de consulta inválido",
        status_code=400
    )

def appointment_time_expired() -> None:
    business_error(
        code="APPOINTMENT_TIME_EXPIRED",
        message="Horário já expirado",
        status_code=400
    )

def appointment_time_unavailable() -> None:
    business_error(
        code="APPOINTMENT_TIME_UNAVAILABLE",
        message="Horário indisponível",
        status_code=400
    )

def appointment_time_already_booked() -> None:
    business_error(
        code="APPOINTMENT_TIME_ALREADY_BOOKED",
        message="Horário já reservado",
        status_code=400
    )

def invalid_doctor() -> None:
    business_error(
        code="INVALID_DOCTOR",
        message="Médico inválido",
        status_code=400
    )

def invalid_time_for_doctor() -> None:
    business_error(
        code="INVALID_TIME_FOR_DOCTOR",
        message="Horário inválido para o médico informado",
        status_code=400
    )

def invalid_doctor_for_clinic() -> None:
    business_error(
        code="INVALID_DOCTOR_FOR_CLINIC",
        message="Médico inválido para a clínica selecionada",
        status_code=400
    )

def invalid_clinical_professional_for_doctor() -> None:
    business_error(
        code="INVALID_CLINICAL_PROFESSIONAL_FOR_DOCTOR",
        message="Profissional clínico inválido para o médico informado",
        status_code=400
    )

def invalid_service_for_doctor_clinic_specialty() -> None:
    business_error(
        code="INVALID_SERVICE_FOR_DOCTOR_CLINIC_SPECIALTY",
        message="Serviço inválido para o médico, clínica ou especialidade selecionados",
        status_code=400
    )

def clinic_not_found() -> None:
    business_error(
        code="CLINIC_NOT_FOUND",
        message="Clínica não encontrada",
        status_code=404
    )

def specialty_not_found() -> None:
    business_error(
        code="SPECIALTY_NOT_FOUND",
        message="Especialidade não encontrada",
        status_code=404
    )

def doctor_not_found() -> None:
    business_error(
        code="DOCTOR_NOT_FOUND",
        message="Médico não encontrado",
        status_code=404
    )

def appointment_not_found() -> None:
    business_error(
        code="APPOINTMENT_NOT_FOUND",
        message="Consulta não encontrada",
        status_code=404
    )

def only_scheduled_appointments_can_be_cancelled() -> None:
    business_error(
        code="ONLY_SCHEDULED_APPOINTMENTS_CAN_BE_CANCELLED",
        message="Apenas consultas agendadas podem ser canceladas",
        status_code=400
    )

def patient_registration_error() -> None:
    business_error(
        code="PATIENT_REGISTRATION_ERROR",
        message="Erro ao cadastrar paciente",
        status_code=400
    )