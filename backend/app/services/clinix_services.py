from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.clinic import Clinic
from app.models.entity import Entity
from app.schemas.clinix_access import OutClinixAccess, UpdateClinixAccess
from app.schemas.clinic import FullClinicRegistration, OutFullClinicRegistration
from app.services.registration import register_address, register_phone
from app.utils.cnpj_utils import cnpj_validator
from app.exceptions.clinic_exceptions import cnpj_already_exists, invalid_cnpj, legal_name_already_exists
from sqlalchemy.exc import IntegrityError

from app.models.clinix_access import ClinixAccess
from app.schemas.clinix_access import LoginClinixAccess, OutLoginClinixAccess
from app.utils.security import verify_password, needs_rehash, hash_password, DUMMY_HASH
from app.utils.jwt import create_access_token
from app.exceptions.auth_exceptions import login_error

def create_full_clinic_service(db: Session, data: FullClinicRegistration) -> OutFullClinicRegistration:
    try:
        with db.begin():
            if not cnpj_validator(data.clinic.cnpj):
                invalid_cnpj()
            
            if db.query(Clinic).filter(Clinic.cnpj == data.clinic.cnpj).first():
                cnpj_already_exists()

            if db.query(Clinic).filter(Clinic.legal_name == data.clinic.legal_name).first():
                legal_name_already_exists()

            entity = Entity(type="C")
            db.add(entity)
            db.flush()

            address = register_address(db=db, data=data.address)
            phone = register_phone(db=db, data=data.phone, entity_id=entity.id)

            clinic = Clinic(
                id=entity.id,
                trade_name=data.clinic.trade_name,
                legal_name=data.clinic.legal_name,
                cnpj=data.clinic.cnpj,
                address_id=address.id
            )
            db.add(clinic)
            db.flush()

            return OutFullClinicRegistration(
                clinic=clinic,
                address=address,
                phone=phone
            )
            
    except HTTPException as e:
        raise e
    except IntegrityError as e:
        print("ERRO DE INTEGRIDADE:", e.orig)
        raise HTTPException(
            status_code=400,
            detail="Erro ao cadastrar clínica: violação de integridade de dados."
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro inesperado ao processar cadastro: {str(e)}")


def get_clinix_user_by_email(db: Session, email: str) -> ClinixAccess | None:
    return db.query(ClinixAccess).filter(ClinixAccess.email == email).first()

def login_clinix_access_service(db: Session, data: LoginClinixAccess) -> OutLoginClinixAccess:
    user = get_clinix_user_by_email(db=db, email=data.email)
    
    password_hash = user.password_hash if user else DUMMY_HASH

    is_valid = verify_password(data.password, password_hash)

    if not user or not is_valid:
        login_error()

    if needs_rehash(user.password_hash):
        user.password_hash = hash_password(data.password)
        db.add(user)
        db.flush()
        db.commit()

    token = create_access_token({"sub": str(user.person_id)})

    return OutLoginClinixAccess(
        access_token=token,
        token_type="bearer"
    )
