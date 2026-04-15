from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.patient_access import LoginPatientAccess
from app.services.login import login_patient_access

router = APIRouter(prefix="/login", tags=["Login"])


@router.post("/patient_access")
def login_patient(data: LoginPatientAccess, db: Session = Depends(get_db)) -> dict:
    return login_patient_access(db, data)