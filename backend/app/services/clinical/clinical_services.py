from fastapi import Depends, Header
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.clinical_access import OutClinicalFeedValidation

from app.models.clinical_access import ClinicalAccess
from app.utils.jwt import decode_access_token

from app.exceptions.clinical_exceptions import (
    missing_authorization_error,
    invalid_token_error,
    clinical_user_not_found_error,
)


def get_current_clinical_user(
    authorization: str | None = Header(None),
    db: Session = Depends(get_db),
) -> ClinicalAccess:
    if not authorization:
        missing_authorization_error()

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        invalid_token_error()

    try:
        payload = decode_access_token(token)
        clinical_access_id = int(payload.get("sub"))
    except (ValueError, TypeError):
        invalid_token_error()

    user = db.query(ClinicalAccess).filter(ClinicalAccess.id == clinical_access_id).first()
    if not user or not user.is_active:
        clinical_user_not_found_error()

    return user


from app.schemas.clinical_access import OutClinicalFeedValidation


def validate_clinical_feed_service(
    clinical_access: ClinicalAccess,
) -> OutClinicalFeedValidation:
    return OutClinicalFeedValidation(
        clinical_access_id=clinical_access.id,
        person_name=clinical_access.person.name,
        role=clinical_access.role,
        clinic_id=clinical_access.clinic_id,
        clinic_name=clinical_access.clinic.trade_name,
        is_active=clinical_access.is_active,
    )