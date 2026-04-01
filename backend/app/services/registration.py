from app.models.address import Address
from app.models.patient_access import PatientAccess
from app.models.person import Person
from app.models.phone import Phone

from app.schemas.patient_access import CreatePatientAccess
from app.schemas.person import CreatePerson
from app.schemas.address import CreateAddress
from app.schemas.phone import CreatePhone

from app.utils.security import hash_password
from app.utils.cpf_utils import cpf_validator

from sqlalchemy.orm import Session


def register_person(person_data: CreatePerson, db: Session) -> Person:
    if not cpf_validator(person_data.cpf):
        raise ValueError("CPF inválido")
    else:
        new_person = Person(
            name=person_data.name,
            cpf=person_data.cpf,
            sex=person_data.sex,
            birthday=person_data.birthday,
            address_id=person_data.address_id
        )

        db.add(new_person)
        db.flush()

        return new_person


def register_address(address_data: CreateAddress, db: Session) -> Address:
    new_address = Address(
        state=address_data.state,
        city=address_data.city,
        neighborhood=address_data.neighborhood,
        street=address_data.street,
        number=address_data.number,
        complement=address_data.complement,
        cep=address_data.cep
    )

    db.add(new_address)
    db.flush()

    return new_address

def register_phone(phone_data: CreatePhone, db: Session) -> Phone:
    new_phone = Phone(
        entity_id=phone_data.entity_id,
        number=phone_data.number,
        type=phone_data.type
    )

    db.add(new_phone)
    db.flush()

    return new_phone


def create_patient_access(patient_access_data: CreatePatientAccess, db: Session) -> PatientAccess:
    new_patient_access = PatientAccess(
        person_id=patient_access_data.person_id,
        email=patient_access_data.email,
        password=hash_password(patient_access_data.password)
    )

    db.add(new_patient_access)
    db.flush()

    return new_patient_access