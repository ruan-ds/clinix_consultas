from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.clinical_access import ClinicalAccess
from app.schemas.clinical_access import OutMeClinicalAccess
from app.services.clinical.clinical_services import get_current_clinical_user

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