from app.exceptions.registration_exceptions import cpf_already_exists, email_already_exists, invalid_cpf

from app.models.address import Address
from app.models.patient_access import PatientAccess
from app.models.person import Person
from app.models.phone import Phone

from app.schemas.patient_access import CreatePatientAccess, FullPatientAccessRegistration
from app.schemas.person import CreatePerson
from app.schemas.address import CreateAddress
from app.schemas.phone import CreatePhone

from app.utils.security import hash_password
from app.utils.cpf_utils import cpf_validator

from fastapi import HTTPException
from sqlalchemy.orm import Session

from sqlalchemy.exc import IntegrityError


def register_person(data: CreatePerson, db: Session, address_id: int) -> Person:
    new_person = Person(
        name=data.name,
        cpf=data.cpf,
        sex=data.sex,
        birthday=data.birthday,
        address_id=address_id  
        )

    db.add(new_person)
    db.flush()

    return new_person


def register_address(data: CreateAddress, db: Session) -> Address:
    new_address = Address(
        state=data.state,
        city=data.city,
        neighborhood=data.neighborhood,
        street=data.street,
        number=data.number,
        complement=data.complement,
        cep=data.cep
    )

    db.add(new_address)
    db.flush()

    return new_address

def register_phone(data: CreatePhone, db: Session, entity_id: int) -> Phone:
    new_phone = Phone(
        entity_id=entity_id,
        number=data.phone,
        type=data.type
    )

    db.add(new_phone)
    db.flush()

    return new_phone


def create_patient_access(data: CreatePatientAccess, db: Session, person_id: int) -> PatientAccess:
    new_patient_access = PatientAccess(
        person_id=person_id,
        email=data.email,
        password=hash_password(data.password)
    )

    db.add(new_patient_access)
    db.flush()

    return new_patient_access


def register_patient_access_service(db: Session, data: FullPatientAccessRegistration):
    try:
        with db.begin():

            if not cpf_validator(data.person.cpf):
                invalid_cpf()   

            address = register_address(data.address, db)

            person = register_person(
                db=db,
                data=data.person,
                address_id=address.id
            )
            
            register_phone(
                db=db,
                data=data.phone,
                entity_id=person.id
            )

            patient_access = create_patient_access(
                db=db,
                data=data.access,
                person_id=person.id
            )

        return patient_access

    except IntegrityError as e:
        error_message = str(e.orig).lower()

        if "uq_person_cpf" in error_message:
            cpf_already_exists()
        
        if "uq_patient_access_email" in error_message:
            email_already_exists()

        raise HTTPException(
        status_code=400,
        detail="Erro ao cadastrar paciente"
    )