from sqlalchemy import text
from sqlalchemy.orm import Session

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError


ph = PasswordHasher()

def hash_password(password: str) -> str:
    return ph.hash(password)


def verify_password(db: Session, email: str, password: str) -> bool:
    try:
        row = db.execute(
            text("""
                SELECT password_hash
                FROM patient_access
                WHERE email = :email
            """),
            {"email": email}
        ).fetchone()

        if not row:
            return False

        password_hash = row[0]

        ph.verify(password_hash, password)

        if ph.check_needs_rehash(password_hash):
            _rehash_password(db, email, password)

        return True

    except (VerifyMismatchError, VerificationError):
        return False


def _rehash_password(db: Session, email: str, password: str):
    new_hash = hash_password(password)

    db.execute(
        text("""
            UPDATE patient_access
            SET password_hash = :hash
            WHERE email = :email
        """),
        {"hash": new_hash, "email": email}
    )

    db.commit()