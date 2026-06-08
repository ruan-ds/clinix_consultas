from fastapi import APIRouter, Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.patient_access import PatientAccess
from app.models.patient import Patient
from app.schemas.medical_appointment import CreatePatientAppointment, FeedValidation, OutMedicalAppointment, OutAppointmentHistory, OutMyDoctor
from app.schemas.patient_access import OutPatientAccess, UpdatePatientContact, UpdatePatientPassword
from app.services.patient_services import (
    create_medical_appointment_service,
    update_patient_contact_service,
    update_patient_password_service,
    validate_feed_service,
    get_appointment_history_service,
    get_my_doctors_service,
)
from app.utils.jwt import decode_access_token
from typing import List

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

@router.get("/history", response_model=List[OutAppointmentHistory])
def get_history(
    db: Session = Depends(get_db),
    current_user: PatientAccess = Depends(get_current_patient)
):
    patient = db.query(Patient).filter(Patient.person_id == current_user.person_id).first()
    
    return get_appointment_history_service(db, patient.id)

@router.get("/my-doctors", response_model=List[OutMyDoctor])
def get_my_doctors(
    current_user: PatientAccess = Depends(get_current_patient),
    db: Session = Depends(get_db),
):
    # Busca o ID clínico do paciente usando o person_id do token
    patient = db.query(Patient).filter(Patient.person_id == current_user.person_id).first()
    return get_my_doctors_service(db, patient.id)