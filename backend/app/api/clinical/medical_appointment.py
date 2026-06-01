from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.schemas.medical_appointment import AppointmentHistoryOut
from app.services.patient_services import get_appointment_history_service

router = APIRouter(prefix="/medical-appointments", tags=["Medical Appointments"])

@router.get("/history", response_model=List[AppointmentHistoryOut])
def get_history(
    patient_id: int, 
    db: Session = Depends(get_db)
):
    return get_appointment_history_service(db, patient_id)
