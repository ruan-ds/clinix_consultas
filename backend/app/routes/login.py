from app.utils.security import verify_password
from app.exceptions.login_exceptions import user_not_found, user_inactive
from app.schemas.patient_access import LoginPatientAccess
from fastapi import APIRouter

router = APIRouter(prefix="/login", tags=["Login"])

@router.post("/patient_access", tags=["Login"])
def login_patient_access(data: LoginPatientAccess):
    result = verify_password(data.password, data.email)

    if result is None:
        user_not_found()

    elif result == "User is inactive":
        user_inactive()

    else:
        return {
            "message": "Login successful", 
            "user_id": result[0], 
            "person_id": result[1],
            "is_active": True
        }