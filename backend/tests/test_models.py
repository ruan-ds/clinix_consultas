import pytest

from datetime import date

from app.models.address import Address
from app.models.person import Person
from app.models.patient_access import PatientAccess
from app.models.entity import Entity

def test_person_with_address_and_pacient_access(db_session):
    address = Address(
        state = "SP",
        city = "FRANCISCO MORATO",
        neighborhood = "BELEM CAPELA",
        street = "RUA DAS HORTENCIAS",
        number = "175",
        complement = None,
        cep = "07991000"
    )

    db_session.add(address)
    db_session.flush()

    person = Person(
        name = "FRANCISCO CABRAL SOARES",
        cpf = "12345678900",
        sex = "M",
        birthday = date(1986, 12, 11),
        address = address
    )

    db_session.add(person)
    db_session.flush()

    pacient_access = PatientAccess(
        person = person,
        email = "person@Example.com",
        password_hash = "hash_aqui",
        is_active = True
    )

    db_session.add(pacient_access)
    db_session.flush()

    saved_person = db_session.query(Person).first()

    assert saved_person is not None
    assert saved_person.address is not None
    assert saved_person.address.city == "FRANCISCO MORATO"
    assert saved_person.patient_access is not None


def test_entity_created_for_person(db_session):

    address = Address(
        state = "SP",
        city = "FRANCISCO MORATO",
        neighborhood = "BELEM CAPELA",
        street = "RUA DAS HORTENCIAS",
        number = "175",
        complement = None,
        cep = "07991000"
    )

    db_session.add(address)
    db_session.flush()

    person = Person(
        name = "FRANCISCO CABRAL SOARES",
        cpf = "12345678900",
        sex = "M",
        birthday = date(1986, 12, 11),
        address = address
    )

    db_session.add(person)
    db_session.flush()

    entity = db_session.query(Entity).filter(Entity.id == person.id).first()

    assert entity is not None
    assert entity.type == "P"