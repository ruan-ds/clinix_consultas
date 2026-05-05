from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.patient_access import LoginPatientAccess, OutLoginPatientAccess
from app.services.login import login_patient_access_service

router = APIRouter(prefix="/login", tags=["Login"])


@router.post("/patient_access", response_model=OutLoginPatientAccess)
def login_patient(data: LoginPatientAccess, db: Session = Depends(get_db)) -> OutLoginPatientAccess:
    return login_patient_access_service(db, data)