from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.clinic import FullClinicRegistration, OutFullClinicRegistration
from app.services.clinix.clinix_services import create_full_clinic_service

router = APIRouter(prefix="/clinix", tags=["Clinix"])

@router.post("/clinic/registration", response_model=OutFullClinicRegistration)
def register_clinic(
    data: FullClinicRegistration, 
    db: Session = Depends(get_db)
) -> OutFullClinicRegistration:
    return create_full_clinic_service(db, data)
