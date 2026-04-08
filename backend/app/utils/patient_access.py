from sqlalchemy import text
from sqlalchemy.orm import Session


def get_user_by_email(db: Session, email: str) -> dict | None:
    row = db.execute(
        text("""
            SELECT id, person_id
            FROM patient_access
            WHERE email = :email
        """),
        {"email": email}
    ).fetchone()

    if not row:
        return None

    user_id, person_id = row

    return {
        "user_id": user_id,
        "person_id": person_id
    }
