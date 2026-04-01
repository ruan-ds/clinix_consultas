from app.exceptions.registration_exceptions import cpf_already_exists, email_already_exists

from app.models.patient_access import PatientAccess

from app.schemas.patient_access import FullPatientAccessRegistration, OutPatientAccess

from app.services.registration import  (
                                        register_person,
                                        register_address,
                                        register_phone,
                                        create_patient_access
                                       )

from app.core.database import get_db

from fastapi import APIRouter, HTTPException, Depends

from sqlalchemy.exc import IntegrityError, Session


router = APIRouter(prefix="/registration", tags=["Registration"])


@router.post("/patient_access", response_model=OutPatientAccess)
def register_patient_access(data: FullPatientAccessRegistration,
                            db: Session = Depends(get_db)) -> PatientAccess:
    person = register_person(data.person, db)    # noqa: F841
    address = register_address(data.address, db) # noqa: F841
    phone = register_phone(data.phone, db)       # noqa: F841

    new_patient_access = create_patient_access(
        patient_access_data=data.access,
        db=db
    )

    try:
        db.commit()
        db.refresh(new_patient_access)

    except IntegrityError as e:
        db.rollback()

        error_message = str(e.orig).lower()

        if "uq_person_cpf" in error_message:
            cpf_already_exists()
        
        if "uq_patient_access_email" in error_message:
            email_already_exists()

        raise HTTPException(
        status_code=400,
        detail="Erro ao cadastrar paciente"
    )
    return new_patient_access