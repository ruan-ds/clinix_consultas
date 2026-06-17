from datetime import datetime, timezone, date
from typing import Optional, List, Dict

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session, joinedload

from app.models.clinical_access import ClinicalAccess
from app.models.medical_specialty import MedicalSpecialty
from app.models.clinic import Clinic
from app.models.doctor import Doctor
from app.models.doctor_schedule_slot import DoctorScheduleSlot
from app.models.doctor_service import DoctorService
from app.models.medical_appointment import MedicalAppointment
from app.models.patient_access import PatientAccess
from app.models.phone import Phone
from app.models.service import Service
from app.schemas.medical_appointment import (
    CreatePatientAppointment,
    FeedValidation,
    OutClinic,
    OutClinicWithService,
    OutDoctor,
    OutService,
    OutServiceCatalogItem,
    OutSlot,
    OutSlotDay,
    OutSpecialty,
)
from app.schemas.patient_access import UpdatePatientContact, UpdatePatientPassword, OutPatientAccessWithName
from app.utils.security import hash_password, verify_password


def get_patient_access_by_patient_id(db: Session, patient_id: int) -> Optional[PatientAccess]:
    return db.query(PatientAccess).filter(PatientAccess.patient_id == patient_id).first()


def validate_feed_service(db: Session, patient_id: int) -> FeedValidation:
    patient_access = get_patient_access_by_patient_id(db, patient_id)

    if not patient_access or not patient_access.is_active:
        raise HTTPException(status_code=404, detail="Paciente não encontrado ou inativo")
    now = datetime.now(timezone.utc)
    next_appt = (
        db.query(MedicalAppointment)
        .options(
            joinedload(MedicalAppointment.doctor).joinedload(Doctor.clinical_access).joinedload(ClinicalAccess.person),
            joinedload(MedicalAppointment.doctor).joinedload(Doctor.specialties),
            joinedload(MedicalAppointment.clinic).joinedload(Clinic.address),
            joinedload(MedicalAppointment.slot),
            joinedload(MedicalAppointment.service),
        )
        .join(DoctorScheduleSlot, MedicalAppointment.slot_id == DoctorScheduleSlot.id)
        .filter(
            MedicalAppointment.patient_id == patient_id,
            MedicalAppointment.is_active == True,
            DoctorScheduleSlot.start_datetime >= now,
        )
        .order_by(DoctorScheduleSlot.start_datetime)
        .first()
    )

    next_appointment_obj = None
    if next_appt:
        doctor_name = "Médico não identificado"
        if getattr(next_appt, "doctor", None):
            ca = getattr(next_appt.doctor, "clinical_access", None)
            person = getattr(ca, "person", None) if ca else None
            if person and getattr(person, "name", None):
                doctor_name = person.name

        clinic_name = "Clínica não identificada"
        if getattr(next_appt, "clinic", None) and getattr(next_appt.clinic, "trade_name", None):
            clinic_name = next_appt.clinic.trade_name

        address_str = "Endereço não disponível"
        if getattr(next_appt, "clinic", None) and getattr(next_appt.clinic, "address", None):
            addr = next_appt.clinic.address
            street = getattr(addr, "street", "")
            number = getattr(addr, "number", "")
            neighborhood = getattr(addr, "neighborhood", "")
            address_str = f"{street}, {number} - {neighborhood}".strip(", - ")

        specialty = "Clínica Geral"
        if getattr(next_appt, "doctor", None) and next_appt.doctor.specialties:
            specialty = ", ".join([s.name for s in next_appt.doctor.specialties])
        elif getattr(next_appt, "service", None) and getattr(next_appt.service, "name", None):
            specialty = next_appt.service.name

        date = None
        if getattr(next_appt, "slot", None) and getattr(next_appt.slot, "start_datetime", None):
            date = next_appt.slot.start_datetime
        else:
            date = next_appt.created_at if getattr(next_appt, "created_at", None) else datetime.utcnow()

        next_appointment_obj = {
            "id": next_appt.id,
            "doctor_name": doctor_name,
            "clinic_name": clinic_name,
            "address": address_str,
            "status": next_appt.status,
            "date": date,
            "specialty": specialty,
        }

    patient_out = OutPatientAccessWithName(
        id=patient_access.id,
        patient_id=patient_access.patient_id,
        email=patient_access.email,
        is_active=patient_access.is_active,
        person_name=patient_access.patient.name,
    )

    return FeedValidation(
        patient=patient_out,
        has_upcoming_appointments=bool(next_appointment_obj),
        next_appointment=next_appointment_obj,
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


def get_patient_contact_service(db: Session, patient_id: int) -> dict:
    patient_access = get_patient_access_by_patient_id(db, patient_id)

    if not patient_access or not patient_access.is_active:
        raise HTTPException(status_code=404, detail="Paciente não encontrado ou inativo")

    phone_entry = (
        db.query(Phone)
        .filter(Phone.entity_id == patient_id)
        .order_by(Phone.id)
        .first()
    )

    return {
        "email": patient_access.email,
        "phone": phone_entry.phone if phone_entry else None,
    }


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

    if slot.doctor_id != doctor.id:
        raise HTTPException(status_code=400, detail="Horário inválido para o médico informado")

    doctor_clinic_id = doctor.clinical_access.clinic_id if doctor.clinical_access else None
    if doctor_clinic_id != data.clinic_id:
        raise HTTPException(status_code=400, detail="Médico inválido para a clínica selecionada")

    if data.clinical_access_id and data.clinical_access_id != doctor.clinical_access_id:
        raise HTTPException(status_code=400, detail="Profissional clínico inválido para o médico informado")

    clinical_access_id = data.clinical_access_id or doctor.clinical_access_id
    service = (
        db.query(Service)
        .outerjoin(
            DoctorService,
            (DoctorService.service_id == Service.id) & (DoctorService.doctor_id == doctor.id),
        )
        .filter(
            Service.id == data.service_id,
            Service.clinic_id == data.clinic_id,
            Service.is_active,
            (DoctorService.doctor_id == doctor.id) | (~Service.doctor_services.any() & Service.medical_specialty.has(MedicalSpecialty.doctors.any(Doctor.id == doctor.id))),
        )
        .first()
    )
    if not service:
        raise HTTPException(status_code=400, detail="Serviço inválido para o médico, clínica ou especialidade selecionados")

    appointment = MedicalAppointment(
        clinic_id=data.clinic_id,
        doctor_id=data.doctor_id,
        patient_id=patient_id,
        clinical_access_id=clinical_access_id,
        service_id=service.id,
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
            joinedload(MedicalAppointment.doctor).joinedload(Doctor.clinical_access).joinedload(ClinicalAccess.person),
            joinedload(MedicalAppointment.doctor).joinedload(Doctor.specialties),
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
        doctor_name = "Médico não identificado"
        if getattr(appt, "doctor", None):
            ca = getattr(appt.doctor, "clinical_access", None)
            person = getattr(ca, "person", None) if ca else None
            if person and getattr(person, "name", None):
                doctor_name = person.name

        clinic_name = "Clínica não identificada"
        if getattr(appt, "clinic", None) and getattr(appt.clinic, "trade_name", None):
            clinic_name = appt.clinic.trade_name

        address_str = "Endereço não disponível"
        location_str = "Local não informado"
        if getattr(appt, "clinic", None):
            clinic_address = getattr(appt.clinic, "address", None)
            if clinic_address:
                city = getattr(clinic_address, "city", "")
                state = getattr(clinic_address, "state", "")
                location_str = ", ".join(p for p in [city, state] if p) or location_str
            elif getattr(appt.clinic, "trade_name", None):
                location_str = appt.clinic.trade_name

        if getattr(appt, "clinic", None) and getattr(appt.clinic, "address", None):
            addr = appt.clinic.address
            street = getattr(addr, "street", "")
            number = getattr(addr, "number", "")
            neighborhood = getattr(addr, "neighborhood", "")
            address_str = f"{street}, {number} - {neighborhood}".strip(", - ")

        # Resgata a especialidade real cadastrada no banco de dados para o médico
        specialty = "Clínica Geral"
        if getattr(appt, "doctor", None) and appt.doctor.specialties:
            specialty = ", ".join([s.name for s in appt.doctor.specialties])
        elif getattr(appt, "service", None) and getattr(appt.service, "name", None):
            specialty = appt.service.name

        date = None
        if getattr(appt, "slot", None) and getattr(appt.slot, "start_datetime", None):
            date = appt.slot.start_datetime
        else:
            date = appt.created_at if getattr(appt, "created_at", None) else datetime.utcnow()

        service_name = None
        service_price = None
        if getattr(appt, "service", None):
            service_name = getattr(appt.service, "name", None)
            service_price = float(appt.service.price) if getattr(appt.service, "price", None) is not None else None

        history.append({
            "id": appt.id,
            "doctor_name": doctor_name,
            "clinic_name": clinic_name,
            "address": address_str,
            "location": location_str,
            "status": appt.status,
            "date": date,
            "specialty": specialty,
            "service_name": service_name,
            "price": service_price,
        })

    return history

    
def list_clinics_service(db: Session) -> List[OutClinic]:
    clinics = db.query(Clinic).filter(Clinic.is_active == True).all()
    result = []
    for c in clinics:
        addr = c.address
        address_str = ""
        if addr:
            parts = [addr.street, addr.number, addr.neighborhood, addr.city]
            address_str = ", ".join(p for p in parts if p)
        result.append(OutClinic(id=c.id, trade_name=c.trade_name, address=address_str))
    return result

def list_available_services_by_specialty_service(db: Session, clinic_id: int, specialty_id: int) -> List[OutService]:
    clinic = db.query(Clinic).filter(Clinic.id == clinic_id, Clinic.is_active).first()
    if not clinic:
        raise HTTPException(status_code=404, detail="Clínica não encontrada")

    specialty = db.query(MedicalSpecialty).filter(MedicalSpecialty.id == specialty_id).first()
    if not specialty:
        raise HTTPException(status_code=404, detail="Especialidade não encontrada")

    now = datetime.now(timezone.utc)
    services = (
        db.query(Service)
        .join(MedicalSpecialty, Service.specialty_id == MedicalSpecialty.id)
        .join(MedicalSpecialty.doctors)
        .join(ClinicalAccess, Doctor.clinical_access_id == ClinicalAccess.id)
        .join(DoctorScheduleSlot, DoctorScheduleSlot.doctor_id == Doctor.id)
        .outerjoin(
            DoctorService,
            (DoctorService.service_id == Service.id) & (DoctorService.doctor_id == Doctor.id),
        )
        .filter(
            Service.clinic_id == clinic_id,
            Service.specialty_id == specialty_id,
            Service.is_active,
            Doctor.is_active,
            ClinicalAccess.clinic_id == clinic_id,
            DoctorScheduleSlot.status == "available",
            DoctorScheduleSlot.start_datetime >= now,
            (DoctorService.doctor_id == Doctor.id) | ~Service.doctor_services.any(),
        )
        .distinct()
        .order_by(Service.name)
        .all()
    )

    return [
        OutService(
            id=service.id,
            clinic_id=service.clinic_id,
            specialty_id=service.specialty_id,
            name=service.name,
            price=float(service.price),
        )
        for service in services
    ]
 
 
def list_doctors_by_clinic_service(db: Session, clinic_id: int) -> List[OutDoctor]:
    clinic = db.query(Clinic).filter(Clinic.id == clinic_id, Clinic.is_active).first()
    if not clinic:
        raise HTTPException(status_code=404, detail="Clínica não encontrada")
 
    doctors = (
        db.query(Doctor)
        .join(ClinicalAccess, Doctor.clinical_access_id == ClinicalAccess.id)
        .filter(ClinicalAccess.clinic_id == clinic_id, Doctor.is_active == True)
        .all()
    )
 
    result = []
    for doc in doctors:
        name = doc.clinical_access.person.name if doc.clinical_access and doc.clinical_access.person else "Médico"
        specialties = [s.name for s in doc.specialties] if doc.specialties else []
        specialty_str = ", ".join(specialties) if specialties else "Clínica Geral"
        result.append(OutDoctor(
            id=doc.id,
            name=name,
            specialty=specialty_str,
            clinic_name=clinic.trade_name,
            clinical_access_id=doc.clinical_access_id,
        ))
    return result
 
 
def list_slots_by_doctor_service(db: Session, doctor_id: int) -> List[OutSlotDay]:
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id, Doctor.is_active == True).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Médico não encontrado")
 
    now = datetime.now(timezone.utc)
    slots = (
        db.query(DoctorScheduleSlot)
        .filter(
            DoctorScheduleSlot.doctor_id == doctor_id,
            DoctorScheduleSlot.status == "available",
            DoctorScheduleSlot.start_datetime >= now,
        )
        .order_by(DoctorScheduleSlot.start_datetime)
        .all()
    )
 
    # Agrupa por dia
    days_map: Dict[str, List[DoctorScheduleSlot]] = {}
    for slot in slots:
        day_key = slot.start_datetime.strftime("%Y-%m-%d")
        days_map.setdefault(day_key, []).append(slot)
 
    today = datetime.now(timezone.utc).date()
    result = []
    for day_key, day_slots in days_map.items():
        day_date = date.fromisoformat(day_key)
        delta = (day_date - today).days
        if delta == 1:
            label = "Amanhã"
        else:
            label = day_date.strftime("%a, %d/%m")
 
        result.append(OutSlotDay(
            date=day_key,
            label=label,
            slots=[OutSlot(
                id=s.id,
                start_datetime=s.start_datetime,
                end_datetime=s.end_datetime,
                status=s.status,
            ) for s in day_slots],
        ))
 
    return result


def get_my_doctors_service(db: Session, patient_id: int):
    results = (
        db.query(Doctor)
        .join(MedicalAppointment, Doctor.id == MedicalAppointment.doctor_id)
        .filter(MedicalAppointment.patient_id == patient_id)
        .group_by(Doctor.id)
        .all()
    )

    my_doctors = []
    for doctor in results:
        specialty_name = doctor.specialties[0].name if doctor.specialties else "Médico"
        
        last_appt = (
            db.query(MedicalAppointment)
            .filter(MedicalAppointment.doctor_id == doctor.id, MedicalAppointment.patient_id == patient_id)
            .order_by(MedicalAppointment.created_at.desc())
            .first()
        )
        
        clinic_name = last_appt.clinic.trade_name if last_appt and last_appt.clinic else "Clínica"
        
        location_str = "Local não informado"
        if last_appt and last_appt.clinic and last_appt.clinic.address:
            addr = last_appt.clinic.address
            location_str = f"{addr.city}/{addr.state}"

        my_doctors.append({
            "id": doctor.id,
            "name": doctor.clinical_access.person.name,
            "specialty": specialty_name,
            "clinic": clinic_name,
            "location": location_str
        })
    
    return my_doctors
def get_active_appointments_service(db: Session, patient_id: int) -> List[Dict]:
    now = datetime.now(timezone.utc)
    appointments = (
        db.query(MedicalAppointment)
        .options(
            joinedload(MedicalAppointment.doctor).joinedload(Doctor.clinical_access).joinedload(ClinicalAccess.person),
            joinedload(MedicalAppointment.doctor).joinedload(Doctor.specialties),
            joinedload(MedicalAppointment.clinic).joinedload(Clinic.address),
            joinedload(MedicalAppointment.slot),
            joinedload(MedicalAppointment.service),
        )
        .join(DoctorScheduleSlot, MedicalAppointment.slot_id == DoctorScheduleSlot.id)
        .filter(
            MedicalAppointment.patient_id == patient_id,
            MedicalAppointment.is_active == True,
            MedicalAppointment.status == "scheduled",
            DoctorScheduleSlot.start_datetime >= now,
        )
        .order_by(DoctorScheduleSlot.start_datetime)
        .all()
    )

    result = []
    for appt in appointments:
        doctor_name = "Médico não identificado"
        if getattr(appt, "doctor", None):
            ca = getattr(appt.doctor, "clinical_access", None)
            person = getattr(ca, "person", None) if ca else None
            if person and getattr(person, "name", None):
                doctor_name = person.name

        clinic_name = "Clínica não identificada"
        if getattr(appt, "clinic", None) and getattr(appt.clinic, "trade_name", None):
            clinic_name = appt.clinic.trade_name

        address_str = "Endereço não disponível"
        if getattr(appt, "clinic", None) and getattr(appt.clinic, "address", None):
            addr = appt.clinic.address
            parts = [getattr(addr, "street", ""), getattr(addr, "number", ""), getattr(addr, "neighborhood", "")]
            address_str = ", ".join(p for p in parts if p)

        # Resgata a especialidade real cadastrada no banco de dados para o médico
        specialty = "Clínica Geral"
        if getattr(appt, "doctor", None) and appt.doctor.specialties:
            specialty = ", ".join([s.name for s in appt.doctor.specialties])
        elif getattr(appt, "service", None) and getattr(appt.service, "name", None):
            specialty = appt.service.name

        date = appt.slot.start_datetime if getattr(appt, "slot", None) else appt.created_at

        service_name = None
        service_price = None
        if getattr(appt, "service", None):
            service_name = getattr(appt.service, "name", None)
            service_price = float(appt.service.price) if getattr(appt.service, "price", None) is not None else None

        result.append({
            "id": appt.id,
            "doctor_name": doctor_name,
            "clinic_name": clinic_name,
            "address": address_str,
            "status": appt.status,
            "date": date,
            "specialty": specialty,
            "service_name": service_name,
            "price": service_price,
        })

    return result


def cancel_appointment_service(db: Session, patient_id: int, appointment_id: int) -> None:
    appointment = (
        db.query(MedicalAppointment)
        .filter(
            MedicalAppointment.id == appointment_id,
            MedicalAppointment.patient_id == patient_id,
            MedicalAppointment.is_active == True,
        )
        .first()
    )

    if not appointment:
        raise HTTPException(status_code=404, detail="Consulta não encontrada")

    if appointment.status != "scheduled":
        raise HTTPException(status_code=400, detail="Apenas consultas agendadas podem ser canceladas")

    slot = db.query(DoctorScheduleSlot).filter(DoctorScheduleSlot.id == appointment.slot_id).first()
    if slot:
        slot.status = "available"
        db.add(slot)

    appointment.status = "cancelled"
    appointment.is_active = False
    db.add(appointment)
    db.commit()


def list_specialties_service(db: Session) -> List[OutSpecialty]:
    specialties = db.query(MedicalSpecialty).order_by(MedicalSpecialty.name).all()
    return [OutSpecialty(id=s.id, name=s.name) for s in specialties]


def list_services_by_specialty_service(db: Session, specialty_id: int) -> List[OutServiceCatalogItem]:
    specialty = db.query(MedicalSpecialty).filter(MedicalSpecialty.id == specialty_id).first()
    if not specialty:
        raise HTTPException(status_code=404, detail="Especialidade não encontrada")

    now = datetime.now(timezone.utc)
    services = (
        db.query(Service)
        .join(MedicalSpecialty, Service.specialty_id == MedicalSpecialty.id)
        .join(MedicalSpecialty.doctors)
        .join(ClinicalAccess, Doctor.clinical_access_id == ClinicalAccess.id)
        .join(DoctorScheduleSlot, DoctorScheduleSlot.doctor_id == Doctor.id)
        .outerjoin(
            DoctorService,
            (DoctorService.service_id == Service.id) & (DoctorService.doctor_id == Doctor.id),
        )
        .filter(
            Service.specialty_id == specialty_id,
            Service.is_active,
            Doctor.is_active,
            ClinicalAccess.clinic_id == Service.clinic_id,
            DoctorScheduleSlot.status == "available",
            DoctorScheduleSlot.start_datetime >= now,
            (DoctorService.doctor_id == Doctor.id) | ~Service.doctor_services.any(),
        )
        .distinct()
        .all()
    )

    grouped: Dict[str, Dict] = {}
    for service in services:
        price = float(service.price)
        entry = grouped.setdefault(service.name, {"min_price": price, "max_price": price, "clinic_ids": set()})
        entry["min_price"] = min(entry["min_price"], price)
        entry["max_price"] = max(entry["max_price"], price)
        entry["clinic_ids"].add(service.clinic_id)

    return [
        OutServiceCatalogItem(
            name=name,
            specialty_id=specialty_id,
            min_price=data["min_price"],
            max_price=data["max_price"],
            clinics_count=len(data["clinic_ids"]),
        )
        for name, data in sorted(grouped.items())
    ]


def list_clinics_by_service_service(db: Session, specialty_id: int, service_name: str) -> List[OutClinicWithService]:
    specialty = db.query(MedicalSpecialty).filter(MedicalSpecialty.id == specialty_id).first()
    if not specialty:
        raise HTTPException(status_code=404, detail="Especialidade não encontrada")

    now = datetime.now(timezone.utc)
    services = (
        db.query(Service)
        .join(Clinic, Service.clinic_id == Clinic.id)
        .join(MedicalSpecialty, Service.specialty_id == MedicalSpecialty.id)
        .join(MedicalSpecialty.doctors)
        .join(ClinicalAccess, Doctor.clinical_access_id == ClinicalAccess.id)
        .join(DoctorScheduleSlot, DoctorScheduleSlot.doctor_id == Doctor.id)
        .outerjoin(
            DoctorService,
            (DoctorService.service_id == Service.id) & (DoctorService.doctor_id == Doctor.id),
        )
        .filter(
            Service.specialty_id == specialty_id,
            Service.name == service_name,
            Service.is_active,
            Clinic.is_active,
            Doctor.is_active,
            ClinicalAccess.clinic_id == Service.clinic_id,
            DoctorScheduleSlot.status == "available",
            DoctorScheduleSlot.start_datetime >= now,
            (DoctorService.doctor_id == Doctor.id) | ~Service.doctor_services.any(),
        )
        .distinct()
        .all()
    )

    result = []
    seen_clinic_ids = set()
    for service in services:
        if service.clinic_id in seen_clinic_ids:
            continue
        seen_clinic_ids.add(service.clinic_id)

        clinic = service.clinic
        addr = clinic.address
        address_str = ""
        if addr:
            parts = [addr.street, addr.number, addr.neighborhood, addr.city]
            address_str = ", ".join(p for p in parts if p)

        result.append(OutClinicWithService(
            id=clinic.id,
            trade_name=clinic.trade_name,
            address=address_str,
            service_id=service.id,
            price=float(service.price),
        ))

    return result


def list_doctors_by_clinic_and_service_service(db: Session, clinic_id: int, service_id: int) -> List[OutDoctor]:
    clinic = db.query(Clinic).filter(Clinic.id == clinic_id, Clinic.is_active).first()
    if not clinic:
        raise HTTPException(status_code=404, detail="Clínica não encontrada")

    service = (
        db.query(Service)
        .filter(Service.id == service_id, Service.clinic_id == clinic_id, Service.is_active)
        .first()
    )
    if not service:
        raise HTTPException(status_code=404, detail="Serviço não encontrado para esta clínica")

    # Se o serviço tiver vínculos explícitos em doctor_service, só esses médicos
    # podem atendê-lo. Caso contrário, qualquer médico ativo da clínica com a
    # especialidade do serviço pode atendê-lo (mesma regra usada na criação do agendamento).
    restricted_doctor_ids = [ds.doctor_id for ds in service.doctor_services]

    query = (
        db.query(Doctor)
        .join(ClinicalAccess, Doctor.clinical_access_id == ClinicalAccess.id)
        .filter(
            ClinicalAccess.clinic_id == clinic_id,
            Doctor.is_active == True,
        )
    )

    if restricted_doctor_ids:
        query = query.filter(Doctor.id.in_(restricted_doctor_ids))
    else:
        query = query.filter(Doctor.specialties.any(MedicalSpecialty.id == service.specialty_id))

    doctors = query.distinct().all()

    result = []
    for doc in doctors:
        name = doc.clinical_access.person.name if doc.clinical_access and doc.clinical_access.person else "Médico"
        specialties = [s.name for s in doc.specialties] if doc.specialties else []
        specialty_str = ", ".join(specialties) if specialties else "Clínica Geral"
        result.append(OutDoctor(
            id=doc.id,
            name=name,
            specialty=specialty_str,
            clinic_name=clinic.trade_name,
            clinical_access_id=doc.clinical_access_id,
        ))
    return result