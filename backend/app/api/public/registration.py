from app.models.patient_access import PatientAccess

from app.schemas.patient_access import FullPatientAccessRegistration, OutPatientAccess

from app.services.registration import register_patient_access_service

from app.core.database import get_db

from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session


router = APIRouter(prefix="/registration", tags=["Registration"])


@router.post("/patient_access", response_model=OutPatientAccess)
def register_patient_access(data: FullPatientAccessRegistration, db: Session = Depends(get_db)) -> PatientAccess:
    return register_patient_access_service(db, data)