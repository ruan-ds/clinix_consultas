from datetime import datetime, timezone, date
from typing import List

from sqlalchemy.orm import Session, joinedload

from sqlalchemy import func, desc

from app.exceptions.clinical_exceptions import (
    doctor_profile_not_found_error,
    appointment_not_found_error,
    invalid_appointment_status_error
)
from app.models.clinical_access import ClinicalAccess
from app.models.doctor import Doctor
from app.models.medical_appointment import MedicalAppointment
from app.models.doctor_schedule_slot import DoctorScheduleSlot
from app.models.patient import Patient

from app.schemas.medical_appointment import OutDoctorScheduleSlot, OutAttendedPatient, OutPatientAppointmentHistory

def get_doctor_schedule_service(
    db: Session, 
    clinical_access: ClinicalAccess
) -> List[OutDoctorScheduleSlot]:
    # 1. Busca o perfil de médico do usuário logado
    doctor = db.query(Doctor).filter(Doctor.clinical_access_id == clinical_access.id).first()
    
    if not doctor:
        doctor_profile_not_found_error()

    now = datetime.now(timezone.utc)

    # 2. Busca consultas ativas do médico (agendadas, confirmadas ou em andamento)
    # Filtramos por slots que ainda não passaram do horário ou que estão em estados não finalizados
    appointments = (
        db.query(MedicalAppointment)
        .options(
            joinedload(MedicalAppointment.slot),
            joinedload(MedicalAppointment.patient),
            joinedload(MedicalAppointment.service).joinedload(lambda s: s.medical_specialty)
        )
        .join(DoctorScheduleSlot)
        .filter(
            MedicalAppointment.doctor_id == doctor.id,
            DoctorScheduleSlot.start_datetime >= now,
            MedicalAppointment.status.notin_(["completed", "cancelled"]),
            MedicalAppointment.is_active == True
        )
        .order_by(DoctorScheduleSlot.start_datetime)
        .all()
    )

    # 3. Mapeia para o schema de saída seguindo a cadeia de busca definida
    result = []
    for appt in appointments:
        result.append(
            OutDoctorScheduleSlot(
                slot_id=appt.slot_id,
                appointment_id=appt.id,
                start_datetime=appt.slot.start_datetime,
                end_datetime=appt.slot.end_datetime,
                slot_status=appt.slot.status,
                appointment_status=appt.status,
                patient_name=appt.patient.name, # Seguindo a FK direta para Person que você mencionou
                service_name=appt.service.name,
                specialty_name=appt.service.medical_specialty.name
            )
        )

    return result


def update_appointment_status_service(
    db: Session,
    clinical_access: ClinicalAccess,
    appointment_id: int,
) -> None:
    doctor = db.query(Doctor).filter(Doctor.clinical_access_id == clinical_access.id).first()

    if not doctor:
        doctor_profile_not_found_error()

    appointment = (
        db.query(MedicalAppointment)
        .filter(
            MedicalAppointment.id == appointment_id,
            MedicalAppointment.doctor_id == doctor.id,
            MedicalAppointment.is_active == True,
        )
        .first()
    )

    if not appointment:
        appointment_not_found_error()

    transitions = {
        "confirmed": "in_progress",
        "in_progress": "completed",
    }

    next_status = transitions.get(appointment.status)

    if not next_status:
        invalid_appointment_status_error()

    appointment.status = next_status

    if next_status == "completed":
        slot = appointment.slot
        slot.status = "completed"
        db.add(slot)

    db.add(appointment)
    db.commit()


def get_attended_patients_history_service(
    db: Session,
    clinical_access: ClinicalAccess,
) -> List[OutAttendedPatient]:
    doctor = db.query(Doctor).filter(Doctor.clinical_access_id == clinical_access.id).first()

    if not doctor:
        doctor_profile_not_found_error()

    results = (
        db.query(
            Patient,
            func.max(MedicalAppointment.created_at).label("last_appointment_date")
        )
        .join(MedicalAppointment, MedicalAppointment.patient_id == Patient.id)
        .filter(
            MedicalAppointment.doctor_id == doctor.id,
            MedicalAppointment.status == "completed",
            MedicalAppointment.is_active == True,
        )
        .group_by(Patient.id)
        .order_by(desc("last_appointment_date"))
        .all()
    )

    attended_patients = []
    today = date.today()
    for patient, last_date in results:
        age = 0
        if patient.person and patient.person.birthday:
            birth = patient.person.birthday
            age = today.year - birth.year - ((today.month, today.day) < (birth.month, birth.day))

        attended_patients.append(
            OutAttendedPatient(
                patient_id=patient.id,
                patient_name=patient.person.name,
                age=age,
                last_appointment_date=last_date,
            )
        )

    return attended_patients


def get_single_patient_history_service(
    db: Session,
    clinical_access: ClinicalAccess,
    patient_id: int
) -> List[OutPatientAppointmentHistory]:
    doctor = db.query(Doctor).filter(Doctor.clinical_access_id == clinical_access.id).first()
    if not doctor:
        doctor_profile_not_found_error()

    appointments = (
        db.query(MedicalAppointment)
        .options(
            joinedload(MedicalAppointment.slot),
            joinedload(MedicalAppointment.service).joinedload(lambda s: s.medical_specialty)
        )
        .filter(
            MedicalAppointment.patient_id == patient_id,
            MedicalAppointment.clinic_id == clinical_access.clinic_id,
            MedicalAppointment.is_active == True
        )
        .join(DoctorScheduleSlot)
        .order_by(DoctorScheduleSlot.start_datetime.desc())
        .all()
    )

    return [
        OutPatientAppointmentHistory(
            appointment_id=appt.id,
            date=appt.slot.start_datetime,
            service_name=appt.service.name,
            specialty_name=appt.service.medical_specialty.name,
            status=appt.status
        )
        for appt in appointments
    ]