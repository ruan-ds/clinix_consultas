import os

from fastapi import Request
from sqlalchemy.orm import Session

from app.models.clinical_access import ClinicalAccess
from app.schemas.clinical_access import LoginClinicalAccess, OutLoginClinicalAccess
from app.utils.auth import login_access_service
from app.exceptions.doctor_exceptions import (
    unauthorized_origin_error,
    missing_origin_config_error,
    inactive_user_error,
)


CLINICAL_ALLOWED_HOST = os.getenv("CLINICAL_ALLOWED_HOST")


def validate_clinical_origin(request: Request) -> None:
    if not CLINICAL_ALLOWED_HOST:
        missing_origin_config_error()

    host = (
        request.headers.get("x-forwarded-host")
        or request.url.hostname
    )

    if host != CLINICAL_ALLOWED_HOST:
        unauthorized_origin_error()


def login_clinical_access_service(
    request: Request,
    db: Session,
    data: LoginClinicalAccess,
) -> OutLoginClinicalAccess:
    validate_clinical_origin(request)

    user = (
        db.query(ClinicalAccess)
        .filter(ClinicalAccess.email == data.email)
        .first()
    )

    if user and not user.is_active:
        inactive_user_error()

    token = login_access_service(
        db=db,
        email=data.email,
        password=data.password,
        model=ClinicalAccess,
        sub_field="id",
        extra_claims={
            "clinic_id": user.clinic_id if user else None,
            "role": user.role if user else None,
        },
    )

    return OutLoginClinicalAccess(
        access_token=token,
        token_type="bearer",
    )