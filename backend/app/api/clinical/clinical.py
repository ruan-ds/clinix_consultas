from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.models.clinical_access import ClinicalAccess
from app.schemas.clinical_access import OutMeClinicalAccess
from app.schemas.medical_appointment import OutDoctorSchedule, UpdateAppointmentStatus
from app.services.clinical.clinical_services import get_current_clinical_user
from app.services.clinical.schedule import get_doctor_schedule_service, update_appointment_status_service

router = APIRouter(prefix="/clinical", tags=["Clinical"])


@router.get("/me", response_model=OutMeClinicalAccess)
def get_me(
    current_user: ClinicalAccess = Depends(get_current_clinical_user),
) -> OutMeClinicalAccess:
    return OutMeClinicalAccess(
        id=current_user.id,
        role=current_user.role,
        person_name=current_user.person.name,
    )


@router.get("/schedule", response_model=List[OutDoctorSchedule])
def get_schedule(
    current_user: ClinicalAccess = Depends(get_current_clinical_user),
    db: Session = Depends(get_db),
) -> List[OutDoctorSchedule]:
    return get_doctor_schedule_service(db=db, clinical_access=current_user)


@router.patch("/appointments/status", status_code=204)
def update_appointment_status(
    data: UpdateAppointmentStatus,
    current_user: ClinicalAccess = Depends(get_current_clinical_user),
    db: Session = Depends(get_db),
) -> None:
    update_appointment_status_service(
        db=db,
        clinical_access=current_user,
        appointment_id=data.appointment_id,
    )