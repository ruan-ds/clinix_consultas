from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.schemas.patient_access import LoginPatientAccess
from app.utils.security import verify_password
from app.utils.jwt import create_access_token
from app.utils.patient_access import get_user_by_email
from app.exceptions.login_exceptions import login_error


def login_patient_access(db: Session, data: LoginPatientAccess):
    if not verify_password(db, data.email, data.password):
        login_error()

    user = get_user_by_email(db, data.email)

    if not user:
        login_error()

    token = create_access_token({
        "sub": str(user["user_id"]),
        "person_id": user["person_id"]
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }