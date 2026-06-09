from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.patient_access import PatientAccess
from app.schemas.medical_appointment import CreatePatientAppointment, FeedValidation, OutMedicalAppointment, AppointmentHistoryItem, OutClinic, OutDoctor, OutSlotDay
from app.schemas.patient_access import OutPatientAccess, UpdatePatientContact, UpdatePatientPassword
from app.services.patient_services import (
    create_medical_appointment_service,
    update_patient_contact_service,
    update_patient_password_service,
    validate_feed_service,
    get_appointment_history_service,
    list_clinics_service,
    list_doctors_by_clinic_service,
    list_slots_by_doctor_service
)
from app.utils.jwt import decode_access_token

router = APIRouter(prefix="/patient", tags=["Patient"])


def get_current_patient(
    authorization: str | None = Header(None),
    db: Session = Depends(get_db),
) -> PatientAccess:
    if not authorization:
        raise HTTPException(status_code=401, detail="Cabeçalho Authorization não enviado")

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=401, detail="Token inválido")

    try:
        payload = decode_access_token(token)
        patient_id = int(payload.get("sub"))
    except (ValueError, TypeError):
        raise HTTPException(status_code=401, detail="Token inválido ou expirado")

    patient = db.query(PatientAccess).filter(PatientAccess.patient_id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=401, detail="Paciente não encontrado")

    return patient


@router.get("/feed/validate", response_model=FeedValidation)
def validate_feed(
    current_user: PatientAccess = Depends(get_current_patient),
    db: Session = Depends(get_db),
) -> FeedValidation:
    return validate_feed_service(db=db, patient_id=current_user.patient_id)


@router.put("/account/password", response_model=OutPatientAccess)
def update_password(
    data: UpdatePatientPassword,
    current_user: PatientAccess = Depends(get_current_patient),
    db: Session = Depends(get_db),
) -> OutPatientAccess:
    return update_patient_password_service(db=db, patient_id=current_user.patient_id, data=data)


@router.put("/account/contact", response_model=OutPatientAccess)
def update_contact(
    data: UpdatePatientContact,
    current_user: PatientAccess = Depends(get_current_patient),
    db: Session = Depends(get_db),
) -> OutPatientAccess:
    return update_patient_contact_service(db=db, patient_id=current_user.patient_id, data=data)


@router.post("/appointments", response_model=OutMedicalAppointment)
def create_appointment(
    data: CreatePatientAppointment,
    current_user: PatientAccess = Depends(get_current_patient),
    db: Session = Depends(get_db),
) -> OutMedicalAppointment:
    return create_medical_appointment_service(db=db, patient_id=current_user.patient_id, data=data)


@router.get("/appointments/history", response_model=List[AppointmentHistoryItem])
def get_appointment_history(
    current_user: PatientAccess = Depends(get_current_patient),
    db: Session = Depends(get_db),
) -> List[AppointmentHistoryItem]:
    return get_appointment_history_service(db=db, patient_id=current_user.patient_id)

@router.get("/clinics", response_model=List[OutClinic])
def list_clinics(
    _: PatientAccess = Depends(get_current_patient),
    db: Session = Depends(get_db),
) -> List[OutClinic]:
    return list_clinics_service(db=db)
 
 
@router.get("/clinics/{clinic_id}/doctors", response_model=List[OutDoctor])
def list_doctors(
    clinic_id: int,
    _: PatientAccess = Depends(get_current_patient),
    db: Session = Depends(get_db),
) -> List[OutDoctor]:
    return list_doctors_by_clinic_service(db=db, clinic_id=clinic_id)
 
 
@router.get("/doctors/{doctor_id}/slots", response_model=List[OutSlotDay])
def list_slots(
    doctor_id: int,
    _: PatientAccess = Depends(get_current_patient),
    db: Session = Depends(get_db),
) -> List[OutSlotDay]:
    return list_slots_by_doctor_service(db=db, doctor_id=doctor_id)
 

