from sqlalchemy.orm import Session

from app.models.patient_access import PatientAccess

from app.schemas.patient_access import (
    LoginPatientAccess,
    OutLoginPatientAccess
)

from app.utils.security import (
    verify_password,
    needs_rehash,
    hash_password,
    DUMMY_HASH
)

from app.utils.jwt import create_access_token

from app.exceptions.auth_exceptions import login_error


def get_user_by_email(
    db: Session,
    email: str
) -> PatientAccess | None:
    return (
        db.query(PatientAccess)
        .filter(PatientAccess.email == email)
        .first()
    )


def update_password_hash(
    db: Session,
    user: PatientAccess,
    new_hash: str
) -> PatientAccess:
    user.password_hash = new_hash

    db.add(user)
    db.flush()
    db.refresh(user)

    return user


def login_patient_access_service(db, data):
    token = login_access_service(
        db=db,
        email=data.email,
        password=data.password,
        model=PatientAccess,
        sub_field="patient_id",
    )
    return OutLoginPatientAccess(access_token=token, token_type="bearer")