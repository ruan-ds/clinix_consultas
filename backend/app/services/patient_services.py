from datetime import datetime, timezone
from typing import Optional, List, Dict

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.models.clinic import Clinic
from app.models.doctor import Doctor
from app.models.doctor_schedule_slot import DoctorScheduleSlot
from app.models.medical_appointment import MedicalAppointment
from app.models.patient_access import PatientAccess
from app.models.phone import Phone
from app.models.service import Service
from app.schemas.medical_appointment import CreatePatientAppointment, FeedValidation
from app.schemas.patient_access import UpdatePatientContact, UpdatePatientPassword, OutPatientAccessWithName
from app.utils.security import hash_password, verify_password


def get_patient_access_by_patient_id(db: Session, patient_id: int) -> Optional[PatientAccess]:
    return db.query(PatientAccess).filter(PatientAccess.patient_id == patient_id).first()


def validate_feed_service(db: Session, patient_id: int) -> FeedValidation:
    patient_access = get_patient_access_by_patient_id(db, patient_id)

    if not patient_access or not patient_access.is_active:
        raise HTTPException(status_code=404, detail="Paciente não encontrado ou inativo")

    next_appointment = (
        db.query(MedicalAppointment)
        .join(DoctorScheduleSlot, MedicalAppointment.slot_id == DoctorScheduleSlot.id)
        .filter(
            MedicalAppointment.patient_id == patient_id,
            MedicalAppointment.is_active,
            DoctorScheduleSlot.start_datetime >= datetime.now(timezone.utc),
        )
        .order_by(DoctorScheduleSlot.start_datetime)
        .first()
    )


    patient_out = OutPatientAccessWithName(
        id=patient_access.id,
        patient_id=patient_access.patient_id,
        email=patient_access.email,
        is_active=patient_access.is_active,
        person_name=patient_access.patient.name,
    )

    return FeedValidation(
        patient=patient_out,
        has_upcoming_appointments=bool(next_appointment),
        next_appointment=next_appointment,
    )


def update_patient_contact_service(db: Session, patient_id: int, data: UpdatePatientContact) -> PatientAccess:
    patient_access = get_patient_access_by_patient_id(db, patient_id)

    if not patient_access or not patient_access.is_active:
        raise HTTPException(status_code=404, detail="Paciente não encontrado ou inativo")

    if data.email and data.email != patient_access.email:
        existing = db.query(PatientAccess).filter(PatientAccess.email == data.email, PatientAccess.patient_id != patient_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="E-mail já em uso")
        patient_access.email = data.email

    phone_entry = None
    if data.phone:
        phone_entry = (
            db.query(Phone)
            .filter(Phone.entity_id == patient_id)
            .order_by(Phone.id)
            .first()
        )

        if phone_entry:
            phone_entry.phone = data.phone
        else:
            phone_entry = Phone(
                entity_id=patient_id,
                phone=data.phone,
                type="mobile"
            )
            db.add(phone_entry)

    try:
        db.add(patient_access)
        if phone_entry and phone_entry.id is None:
            db.add(phone_entry)
        db.commit()
        db.refresh(patient_access)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Erro ao atualizar configurações de conta")

    return patient_access


def update_patient_password_service(db: Session, patient_id: int, data: UpdatePatientPassword) -> PatientAccess:
    patient_access = get_patient_access_by_patient_id(db, patient_id)

    if not patient_access or not patient_access.is_active:
        raise HTTPException(status_code=404, detail="Paciente não encontrado ou inativo")

    if data.new_password != data.confirm_password:
        raise HTTPException(status_code=400, detail="A nova senha e a confirmação não coincidem")

    if not verify_password(data.current_password, patient_access.password_hash):
        raise HTTPException(status_code=401, detail="Senha atual incorreta")

    patient_access.password_hash = hash_password(data.new_password)

    db.add(patient_access)
    db.commit()
    db.refresh(patient_access)

    return patient_access


def create_medical_appointment_service(db: Session, patient_id: int, data: CreatePatientAppointment) -> MedicalAppointment:
    patient_access = get_patient_access_by_patient_id(db, patient_id)

    if not patient_access or not patient_access.is_active:
        raise HTTPException(status_code=404, detail="Paciente não encontrado ou inativo")

    slot = db.query(DoctorScheduleSlot).filter(DoctorScheduleSlot.id == data.slot_id).first()
    if not slot:
        raise HTTPException(status_code=400, detail="Horário de consulta inválido")

    if slot.start_datetime < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="Horário já expirado")

    if slot.status != "available":
        raise HTTPException(status_code=400, detail="Horário indisponível")

    if db.query(MedicalAppointment).filter(MedicalAppointment.slot_id == slot.id).first():
        raise HTTPException(status_code=400, detail="Horário já reservado")

    doctor = db.query(Doctor).filter(Doctor.id == data.doctor_id, Doctor.is_active).first()
    if not doctor:
        raise HTTPException(status_code=400, detail="Médico inválido")

    if data.clinical_access_id and data.clinical_access_id != doctor.clinical_access_id:
        raise HTTPException(status_code=400, detail="Profissional clínico inválido para o médico informado")

    clinical_access_id = data.clinical_access_id or doctor.clinical_access_id
    service_id = data.service_id

    if service_id is None:
        service = (
            db.query(Service)
            .filter(Service.clinic_id == data.clinic_id, Service.is_active)
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
                Service.is_active,
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

    db.add(appointment)
    slot.status = "booked"
    db.add(slot)
    db.commit()
    db.refresh(appointment)

    return appointment


def get_appointment_history_service(db: Session, patient_id: int) -> List[Dict]:
    appointments = (
        db.query(MedicalAppointment)
        .options(
            joinedload(MedicalAppointment.doctor).joinedload(ClinicalAccess.person),
            joinedload(MedicalAppointment.clinic).joinedload(Clinic.address),
            joinedload(MedicalAppointment.slot),
            joinedload(MedicalAppointment.service),
        )
        .filter(MedicalAppointment.patient_id == patient_id)
        .order_by(MedicalAppointment.created_at.desc())
        .all()
    )

    history = []
    for appt in appointments:
        # doctor name
        doctor_name = "Médico não identificado"
        if getattr(appt, "doctor", None):
            ca = getattr(appt.doctor, "clinical_access", None)
            person = getattr(ca, "person", None) if ca else None
            if person and getattr(person, "name", None):
                doctor_name = person.name

        # clinic name
        clinic_name = "Clínica não identificada"
        if getattr(appt, "clinic", None) and getattr(appt.clinic, "trade_name", None):
            clinic_name = appt.clinic.trade_name

        # address string
        address_str = "Endereço não disponível"
        if getattr(appt, "clinic", None) and getattr(appt.clinic, "address", None):
            addr = appt.clinic.address
            street = getattr(addr, "street", "")
            number = getattr(addr, "number", "")
            neighborhood = getattr(addr, "neighborhood", "")
            address_str = f"{street}, {number} - {neighborhood}".strip(", - ")

        # specialty
        specialty = "Consulta Geral"
        if getattr(appt, "service", None) and getattr(appt.service, "name", None):
            specialty = appt.service.name

        # date: prefer slot.start_datetime, fallback para created_at
        date = None
        if getattr(appt, "slot", None) and getattr(appt.slot, "start_datetime", None):
            date = appt.slot.start_datetime
        else:
            date = appt.created_at if getattr(appt, "created_at", None) else datetime.utcnow()

        history.append({
            "id": appt.id,
            "doctor_name": doctor_name,
            "clinic_name": clinic_name,
            "address": address_str,
            "status": appt.status,
            "date": date,
            "specialty": specialty
        })

    return history