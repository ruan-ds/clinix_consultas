from app.exceptions.auth_exceptions import cpf_already_exists, email_already_exists, invalid_cpf

from app.models.address import Address
from app.models.patient import Patient
from app.models.patient_access import PatientAccess
from app.models.person import Person
from app.models.phone import Phone

from app.schemas.patient_access import CreatePatientAccess, FullPatientAccessRegistration, OutFullPatientAccess
from app.schemas.person import CreatePerson
from app.schemas.address import CreateAddress
from app.schemas.phone import CreatePhone

from app.utils.security import hash_password
from app.utils.cpf_utils import cpf_validator

from fastapi import HTTPException
from sqlalchemy.orm import Session

from sqlalchemy import insert
from sqlalchemy.exc import IntegrityError


def register_person(db: Session, data: CreatePerson, address_id: int) -> Person:
    new_person = Person(
        name=data.name,
        cpf=data.cpf,
        sex=data.sex,
        birthday=data.birthday,
        address_id=address_id  
        )

    db.add(new_person)
    db.flush()
    db.refresh(new_person)

    return new_person


def register_address(db: Session, data: CreateAddress) -> Address:
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
    db.refresh(new_address)

    return new_address

def register_phone(db: Session, data: CreatePhone, entity_id: int) -> Phone:
    new_phone = Phone(
        entity_id=entity_id,
        phone=data.phone,
        type=data.type
    )

    db.add(new_phone)
    db.flush()
    db.refresh(new_phone)

    return new_phone


def create_patient(db: Session, person_id: int) -> Patient:
    db.execute(insert(Patient).values(id=person_id))
    return db.query(Patient).filter(Patient.id == person_id).first()


def create_patient_access(db: Session, data: CreatePatientAccess, patient_id: int) -> PatientAccess:
    new_patient_access = PatientAccess(
        patient_id=patient_id,
        email=data.email,
        password_hash=hash_password(data.password)
    )

    db.add(new_patient_access)
    db.flush()
    db.refresh(new_patient_access)

    return new_patient_access


def register_patient_access_service(db: Session, data: FullPatientAccessRegistration):
    try:
        with db.begin():

            if not cpf_validator(data.person.cpf):
                invalid_cpf()
            
            if db.query(Person).filter(Person.cpf == data.person.cpf).first():
                cpf_already_exists()

            if db.query(PatientAccess).filter(PatientAccess.email == data.access.email).first():
                email_already_exists()

            address = register_address(
                db=db,
                data=data.address
                )

            person = register_person(
                db=db,
                data=data.person,
                address_id=address.id
            )
            
            phone = register_phone(
                db=db,
                data=data.phone,
                entity_id=person.id
            )

            patient = create_patient(
                db=db,
                person_id=person.id
            )

            patient_access = create_patient_access(
                db=db,
                data=data.access,
                patient_id=patient.id
            )

            return OutFullPatientAccess(  
                person=person,  
                address=address,  
                phone=phone,  
                access=patient_access  
            )
        
    except IntegrityError as e:
        print("ERRO REAL:", e.orig)
        raise HTTPException(
        status_code=400,
        detail="Erro ao cadastrar paciente"
    )