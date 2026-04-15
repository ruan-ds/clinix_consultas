from sqlalchemy import text
from sqlalchemy.orm import Session


def get_user_by_email(db: Session, email: str) -> dict | None:
    row = db.execute(
        text("""
            SELECT id, person_id, password_hash
            FROM patient_access
            WHERE email = :email
        """),
        {"email": email}
    ).fetchone()

    if not row:
        return None

    return {
        "user_id": row[0],
        "person_id": row[1],
        "password_hash": row[2]
    }


def update_password_hash(db: Session, email: str, new_hash: str) -> None:
    db.execute(
        text("""
            UPDATE patient_access
            SET password_hash = :hash
            WHERE email = :email
        """),
        {"hash": new_hash, "email": email}
    )
    db.commit()