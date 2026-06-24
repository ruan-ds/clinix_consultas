from sqlalchemy.orm import Session

from app.utils.security import (
    verify_password,
    needs_rehash,
    hash_password,
    DUMMY_HASH,
)

from app.utils.jwt import create_access_token
from app.exceptions.patient_exceptions import login_error


def login_access_service(
    db: Session,
    email: str,
    password: str,
    model,
    sub_field: str,
    extra_claims: dict = {},
) -> str:
    user = (
        db.query(model)
        .filter(model.email == email)
        .first()
    )

    password_hash = user.password_hash if user else DUMMY_HASH

    is_valid = verify_password(password, password_hash)

    if not user or not is_valid:
        login_error()

    if needs_rehash(user.password_hash):
        user.password_hash = hash_password(password)
        db.add(user)
        db.flush()
        db.refresh(user)
        db.commit()

    token = create_access_token({
        "sub": str(getattr(user, sub_field)),
        **extra_claims,
    })

    return token