from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.clinic import Clinic
from app.models.entity import Entity
from app.schemas.clinic import FullClinicRegistration, OutFullClinicRegistration
from app.services.registration import register_address, register_phone
from app.utils.cnpj_utils import cnpj_validator

def create_full_clinic_service(db: Session, data: FullClinicRegistration) -> OutFullClinicRegistration:
    try:
        with db.begin():
            if not cnpj_validator(data.clinic.cnpj):
                raise HTTPException(status_code=400, detail="CNPJ inválido")

            if db.query(Clinic).filter(Clinic.cnpj == data.clinic.cnpj).first():
                raise HTTPException(status_code=400, detail="CNPJ já cadastrado")

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
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao processar cadastro: {str(e)}")
