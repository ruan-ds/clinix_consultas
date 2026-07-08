"""
Seed script MÍNIMO para popular o banco com o essencial para testar em ambiente virgem.

NÃO cria Patient, PatientAccess, Dependent, MedicalAppointment, Service,
MedicalSpecialty, DoctorSchedule* etc. Apenas o mínimo pedido:

  - 1 Address (compartilhado, para simplificar)
  - 1 Clinic
  - 3 Person (Dr. Silva, Recepção, Administrador)
  - 3 ClinicalAccess (role='doctor', role='recepcao', role='administrador')
  - 1 Doctor (vinculado ao ClinicalAccess do Dr. Silva)

IMPORTANTE sobre IDs:
  Person e Clinic herdam de Entity via joined-table inheritance
  (id = Column(Integer, ForeignKey("entity.id"), primary_key=True)).
  Isso significa que o SQLAlchemy, ao dar flush/commit num Person ou Clinic,
  insere PRIMEIRO na tabela `entity` (gerando o id autoincrement) e depois
  usa esse MESMO id na tabela filha (`person`/`clinic`). Não é necessário
  (nem correto) setar id manualmente em nenhum ponto deste script.

Ajuste antes de rodar:
  - O import de SessionLocal/engine abaixo é um placeholder — troque pelo
    factory de sessão real do seu projeto (ex: app.core.database.SessionLocal).
  - A função hash_password() é um placeholder (sha256). Troque pela função
    de hash real usada no projeto (ex: passlib/bcrypt) se ela existir.

Uso:
    python seed_minimal.py
"""

import hashlib
from datetime import date

# --- Ajuste este import conforme a estrutura real do seu projeto ---
from app.core.database import SessionLocal

from app.models.address import Address
from app.models.clinic import Clinic
from app.models.person import Person
from app.models.clinical_access import ClinicalAccess
from app.models.doctor import Doctor


def hash_password(raw: str) -> str:
    """Placeholder simples. Substitua pela função de hash real do projeto."""
    return hashlib.sha256(raw.encode()).hexdigest()


def get_or_create_address(session) -> Address:
    address = session.query(Address).filter_by(cep="20000000").first()
    if address:
        return address
    address = Address(
        state="RJ",
        city="Rio de Janeiro",
        neighborhood="Centro",
        street="Rua Teste",
        number="100",
        complement=None,
        cep="20000000",
    )
    session.add(address)
    session.flush()  # gera address.id
    return address


def get_or_create_clinic(session, address: Address) -> Clinic:
    clinic = session.query(Clinic).filter_by(cnpj="00000000000191").first()
    if clinic:
        return clinic
    # Ao dar flush aqui, o SQLAlchemy insere em `entity` (gera id) e depois
    # em `clinic` usando o mesmo id automaticamente.
    clinic = Clinic(
        trade_name="Clinica Teste",
        legal_name="Clinica Teste LTDA",
        cnpj="00000000000191",
        address_id=address.id,
        is_active=True,
    )
    session.add(clinic)
    session.flush()
    return clinic


def get_or_create_person(session, address: Address, name: str, cpf: str, sex: str, birthday: date) -> Person:
    person = session.query(Person).filter_by(cpf=cpf).first()
    if person:
        return person
    # Mesma lógica: insere em `entity` primeiro, depois em `person`, mesmo id.
    person = Person(
        name=name,
        cpf=cpf,
        sex=sex,
        birthday=birthday,
        address_id=address.id,
    )
    session.add(person)
    session.flush()
    return person


def get_or_create_clinical_access(session, clinic: Clinic, person: Person, email: str, role: str) -> ClinicalAccess:
    access = session.query(ClinicalAccess).filter_by(email=email).first()
    if access:
        return access
    access = ClinicalAccess(
        clinic_id=clinic.id,
        person_id=person.id,
        email=email,
        password_hash=hash_password("Teste@123"),
        role=role,
        is_active=True,
    )
    session.add(access)
    session.flush()
    return access


def get_or_create_doctor(session, clinical_access: ClinicalAccess, crm: str) -> Doctor:
    doctor = session.query(Doctor).filter_by(crm=crm).first()
    if doctor:
        return doctor
    doctor = Doctor(
        clinical_access_id=clinical_access.id,
        crm=crm,
        is_active=True,
    )
    session.add(doctor)
    session.flush()
    return doctor


def main():
    session = SessionLocal()
    try:
        # 1) Address
        address = get_or_create_address(session)

        # 2) Clinic
        clinic = get_or_create_clinic(session, address)

        # 3) Persons + 4) ClinicalAccess + 5) Doctor

        # --- Doutor Silva ---
        person_doctor = get_or_create_person(
            session, address,
            name="Carlos Silva",
            cpf="11111111111",
            sex="M",
            birthday=date(1980, 5, 10),
        )
        access_doctor = get_or_create_clinical_access(
            session, clinic, person_doctor,
            email="dr.silva@clinicateste.com",
            role="doctor",
        )
        get_or_create_doctor(session, access_doctor, crm="CRM-RJ-123456")

        # --- Recepção ---
        person_recepcao = get_or_create_person(
            session, address,
            name="Ana Recepcao",
            cpf="22222222222",
            sex="F",
            birthday=date(1995, 3, 20),
        )
        get_or_create_clinical_access(
            session, clinic, person_recepcao,
            email="recepcao@clinicateste.com",
            role="recepcao",
        )

        # --- Administrador (role dentro de clinical_access) ---
        person_admin = get_or_create_person(
            session, address,
            name="Roberto Admin",
            cpf="33333333333",
            sex="M",
            birthday=date(1985, 8, 15),
        )
        get_or_create_clinical_access(
            session, clinic, person_admin,
            email="admin@clinicateste.com",
            role="administrador",
        )

        session.commit()
        print("Seed minimo executado com sucesso.")
        print(f"  Clinic id: {clinic.id}")
        print(f"  Dr. Silva - Person id: {person_doctor.id} | ClinicalAccess id: {access_doctor.id}")
        print(f"  Recepcao  - Person id: {person_recepcao.id}")
        print(f"  Admin     - Person id: {person_admin.id}")

    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


if __name__ == "__main__":
    main()