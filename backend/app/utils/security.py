from sqlalchemy import text
from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError, VerificationError

ph = PasswordHasher()


def hash_password(password: str) -> str:
    return ph.hash(password)


def verify_password(password: str, email: str) -> str | tuple | None:
    try:
        row = db_session(
        text(
                "SELECT id, person_id, password_hash, is_active "
                "FROM patient_access WHERE email = :email"
        ),
        {"email": email}
        ).fetchone()

        if not row:
            return None

        if not row[3]:
            return "User is inactive"


        hashed_password = row[2]

        ph.verify(hashed_password, password)

        if ph.check_needs_rehash(hashed_password):
            new_hashed_password = hash_password(password)

            db_session(
                text("UPDATE patient_access SET password_hash = :hash WHERE email = :email"),
                {"hash": new_hashed_password, "email": email}
            )
            db_session.commit()

        return (row[0], row[1])

    except (VerifyMismatchError, VerificationError):
        return None