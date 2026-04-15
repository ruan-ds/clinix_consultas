from sqlalchemy.orm import Session

from app.schemas.patient_access import LoginPatientAccess
from app.repositories.patient_access import get_user_by_email, update_password_hash
from app.utils.security import verify_password, needs_rehash, hash_password, DUMMY_HASH
from app.utils.jwt import create_access_token
from app.exceptions.login_exceptions import login_error


def login_patient_access(db: Session, data: LoginPatientAccess):
    user = get_user_by_email(db, data.email)

    # Sempre roda verify_password, mesmo se usuário não existir (evita timing attack)
    password_hash = user["password_hash"] if user else DUMMY_HASH
    is_valid = verify_password(data.password, password_hash)

    if not user or not is_valid:
        login_error()

    if needs_rehash(user["password_hash"]):
        new_hash = hash_password(data.password)
        update_password_hash(db, data.email, new_hash)

    token = create_access_token({
        "sub": str(user["user_id"]),
        "person_id": user["person_id"]
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }