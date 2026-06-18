from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.clinix_access import LoginClinixAccess, OutLoginClinixAccess
from app.services.clinix_services import login_clinix_access_service


router = APIRouter(prefix="/clinix", tags=["Clinix Login"])


@router.post("/login", response_model=OutLoginClinixAccess)
def login_clinix(
    data: LoginClinixAccess,
    db: Session = Depends(get_db)
) -> OutLoginClinixAccess:
    return login_clinix_access_service(db, data)
