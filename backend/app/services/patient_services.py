from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models.doctor import Doctor
from app.models.doctor_schedule_slot import DoctorScheduleSlot
from app.models.medical_appointment import MedicalAppointment
from app.models.patient_access import PatientAccess
from app.models.phone import Phone
from app.models.service import Service
from app.schemas.medical_appointment import CreatePatientAppointment, FeedValidation
from app.schemas.patient_access import UpdatePatientContact, UpdatePatientPassword
from app.utils.security import hash_password, verify_password


def get_patient_access_by_id(db: Session, patient_id: int) -> Optional[PatientAccess]:
    return db.query(PatientAccess).filter(PatientAccess.id == patient_id).first()


def validate_feed_service(db: Session, patient_id: int) -> FeedValidation:
    patient = get_patient_access_by_id(db, patient_id)

    if not patient or not patient.is_active:
        raise HTTPException(status_code=404, detail="Paciente não encontrado ou inativo")

    next_appointment = (
        db.query(MedicalAppointment)
        .join(DoctorScheduleSlot, MedicalAppointment.slot_id == DoctorScheduleSlot.id)
        .filter(
            MedicalAppointment.patient_id == patient_id,
            MedicalAppointment.is_active == True,
            DoctorScheduleSlot.start_datetime >= datetime.now(timezone.utc),
        )
        .order_by(DoctorScheduleSlot.start_datetime)
        .first()
    )

    return FeedValidation(
        patient=patient,
        has_upcoming_appointments=bool(next_appointment),
        next_appointment=next_appointment,
    )


def update_patient_contact_service(db: Session, patient_id: int, data: UpdatePatientContact) -> PatientAccess:
    patient = get_patient_access_by_id(db, patient_id)

    if not patient or not patient.is_active:
        raise HTTPException(status_code=404, detail="Paciente não encontrado ou inativo")

    if data.email and data.email != patient.email:
        existing = db.query(PatientAccess).filter(PatientAccess.email == data.email, PatientAccess.id != patient_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="E-mail já em uso")
        patient.email = data.email

    phone_entry = None
    if data.phone:
        phone_entry = (
            db.query(Phone)
            .filter(Phone.entity_id == patient.person_id)
            .order_by(Phone.id)
            .first()
        )

        if phone_entry:
            phone_entry.phone = data.phone
        else:
            phone_entry = Phone(
                entity_id=patient.person_id,
                phone=data.phone,
                type="mobile"
            )
            db.add(phone_entry)

    try:
        with db.begin():
            db.add(patient)
            if phone_entry and phone_entry.id is None:
                db.add(phone_entry)
            db.flush()
            db.refresh(patient)
    except IntegrityError:
        raise HTTPException(status_code=400, detail="Erro ao atualizar configurações de conta")

    return patient


def update_patient_password_service(db: Session, patient_id: int, data: UpdatePatientPassword) -> PatientAccess:
    patient = get_patient_access_by_id(db, patient_id)

    if not patient or not patient.is_active:
        raise HTTPException(status_code=404, detail="Paciente não encontrado ou inativo")

    if data.new_password != data.confirm_password:
        raise HTTPException(status_code=400, detail="A nova senha e a confirmação não coincidem")

    if not verify_password(data.current_password, patient.password_hash):
        raise HTTPException(status_code=401, detail="Senha atual incorreta")

    patient.password_hash = hash_password(data.new_password)

    with db.begin():
        db.add(patient)
        db.flush()
        db.refresh(patient)

    return patient


def create_medical_appointment_service(db: Session, patient_id: int, data: CreatePatientAppointment) -> MedicalAppointment:
    patient = get_patient_access_by_id(db, patient_id)

    if not patient or not patient.is_active:
        raise HTTPException(status_code=404, detail="Paciente não encontrado ou inativo")

    slot = db.query(DoctorScheduleSlot).filter(DoctorScheduleSlot.id == data.slot_id).first()
    if not slot:
        raise HTTPException(status_code=400, detail="Horário de consulta inválido")

    if slot.start_datetime < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Horário já expirado")

    if db.query(MedicalAppointment).filter(MedicalAppointment.slot_id == slot.id).first():
        raise HTTPException(status_code=400, detail="Horário já reservado")

    doctor = db.query(Doctor).filter(Doctor.id == data.doctor_id, Doctor.is_active == True).first()
    if not doctor:
        raise HTTPException(status_code=400, detail="Médico inválido")

    clinical_access_id = data.clinical_access_id or doctor.clinical_access_id
    service_id = data.service_id

    if service_id is None:
        service = (
            db.query(Service)
            .filter(Service.clinic_id == data.clinic_id, Service.is_active == True)
            .order_by(Service.id)
            .first()
        )
        if not service:
            raise HTTPException(status_code=400, detail="Nenhum serviço ativo encontrado para a clínica selecionada")
        service_id = service.id
    else:
        service = (
            db.query(Service)
            .filter(
                Service.id == service_id,
                Service.clinic_id == data.clinic_id,
                Service.is_active == True,
            )
            .first()
        )
        if not service:
            raise HTTPException(status_code=400, detail="Serviço inválido para a clínica selecionada")

    appointment = MedicalAppointment(
        clinic_id=data.clinic_id,
        doctor_id=data.doctor_id,
        patient_id=patient_id,
        clinical_access_id=clinical_access_id,
        service_id=service_id,
        slot_id=slot.id,
        status="scheduled",
        notes=data.notes,
    )

    with db.begin():
        db.add(appointment)
        slot.status = "booked"
        db.add(slot)
        db.flush()
        db.refresh(appointment)

    return appointment
