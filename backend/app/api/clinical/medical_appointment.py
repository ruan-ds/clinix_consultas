from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.medical_appointment import OutAppointmentHistory
from app.services.patient_services import get_appointment_history_service
from app.api.public.patient import get_current_patient
from app.models.patient_access import PatientAccess
from app.models.patient import Patient

router = APIRouter(prefix="/medical-appointments", tags=["Medical Appointments"])

@router.get("/history", response_model=List[OutAppointmentHistory])
def get_history(
    db: Session = Depends(get_db),
    current_user: PatientAccess = Depends(get_current_patient)
):
    patient = db.query(Patient).filter(Patient.person_id == current_user.person_id).first()
    
    return get_appointment_history_service(db, patient.id)
