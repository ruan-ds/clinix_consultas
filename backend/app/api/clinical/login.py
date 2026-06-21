from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.clinical_access import LoginClinicalAccess, OutLoginClinicalAccess
from app.services.clinical.login import login_clinical_access_service

router = APIRouter(prefix="/login", tags=["Login"])


@router.post("/clinical_access", response_model=OutLoginClinicalAccess)
def login_clinical_access(
    request: Request,
    data: LoginClinicalAccess,
    db: Session = Depends(get_db),
) -> OutLoginClinicalAccess:
    return login_clinical_access_service(request=request, db=db, data=data)