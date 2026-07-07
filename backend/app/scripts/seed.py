"""
Script de seed MÍNIMO para popular o banco com dados de teste "virgem".

O que este script NÃO cria (conforme solicitado):
    - medical_appointment
    - logs
    - dependent

O que ele cria (respeitando a ordem de FKs):
    1. address                 (clínica, médico, recepção, administrador e paciente)
    2. person + entity         (médico, recepção, administrador, paciente) -> entity.id é
                                 gerado automaticamente e reaproveitado em person.id
                                 (joined-table inheritance: Entity -> Person).
    3. clinic + entity         (mesma lógica de herança de Entity)
    4. phone                   (um telefone por entity: médico, recepção, admin, paciente, clínica)
    5. clinical_access         (role='doctor', role='recepcao', role='administrador')
    6. clinix_access           (acesso de sistema, reaproveitando o admin)
    7. doctor                  (Dr. Silva, vinculado ao clinical_access do médico)
    8. medical_specialty
    9. doctor_specialty
   10. service
   11. doctor_service
   12. doctor_schedule_config
   13. doctor_schedule_slot
   14. patient                 (Patient não herda mais de Person, é FK simples pra person.id)
   15. patient_access

IMPORTANTE:
    - Usa `SessionLocal` de `app.core.database` (sessionmaker puro, sem dependência
      de request), então dá pra instanciar direto num script standalone.
    - Não me preocupei com a conexão em si, só com a ordem de criação/commit.
    - Rode com:  python seed_minimo.py
"""

from datetime import date, time, datetime, timedelta, timezone

from app.core.database import SessionLocal

from app.models.address import Address
from app.models.person import Person
from app.models.clinic import Clinic
from app.models.phone import Phone
from app.models.clinical_access import ClinicalAccess
from app.models.clinix_access import ClinixAccess
from app.models.doctor import Doctor
from app.models.medical_specialty import MedicalSpecialty
from app.models.doctor_specialty import DoctorSpecialty
from app.models.service import Service
from app.models.doctor_service import DoctorService
from app.models.doctor_schedule_config import DoctorScheduleConfig
from app.models.doctor_schedule_slot import DoctorScheduleSlot
from app.models.patient import Patient
from app.models.patient_access import PatientAccess

from app.utils.security import hash_password


CPF_FOR_TESTS = [
    "12345678062",
    "11122233396",
    "52998224725",
    "93541134780",
    "28625587887",
    "39053344705",
    "16899535009",
    "71460238001",
    "98765432100",
    "74682489070",
]


def register_address(db, **kwargs) -> Address:
    obj = Address(**kwargs)
    db.add(obj)
    db.flush()
    db.refresh(obj)
    return obj


def register_person(db, address_id: int, **kwargs) -> Person:
    obj = Person(address_id=address_id, **kwargs)
    db.add(obj)
    db.flush()
    db.refresh(obj)
    return obj


def register_clinic(db, address_id: int, **kwargs) -> Clinic:
    obj = Clinic(address_id=address_id, **kwargs)
    db.add(obj)
    db.flush()
    db.refresh(obj)
    return obj


def register_phone(db, entity_id: int, phone: str, type_: str) -> Phone:
    obj = Phone(entity_id=entity_id, phone=phone, type=type_)
    db.add(obj)
    db.flush()
    db.refresh(obj)
    return obj


def register_clinical_access(db, clinic_id: int, person_id: int, email: str, password: str, role: str) -> ClinicalAccess:
    obj = ClinicalAccess(
        clinic_id=clinic_id,
        person_id=person_id,
        email=email,
        password_hash=hash_password(password),
        role=role,
    )
    db.add(obj)
    db.flush()
    db.refresh(obj)
    return obj


def register_clinix_access(db, person_id: int, email: str, password: str, role: str) -> ClinixAccess:
    obj = ClinixAccess(
        person_id=person_id,
        email=email,
        password_hash=hash_password(password),
        role=role,
    )
    db.add(obj)
    db.flush()
    db.refresh(obj)
    return obj


def register_doctor(db, clinical_access_id: int, crm: str) -> Doctor:
    obj = Doctor(clinical_access_id=clinical_access_id, crm=crm)
    db.add(obj)
    db.flush()
    db.refresh(obj)
    return obj


def register_medical_specialty(db, name: str) -> MedicalSpecialty:
    obj = MedicalSpecialty(name=name)
    db.add(obj)
    db.flush()
    db.refresh(obj)
    return obj


def register_doctor_specialty(db, doctor_id: int, specialty_id: int) -> DoctorSpecialty:
    obj = DoctorSpecialty(doctor_id=doctor_id, specialty_id=specialty_id)
    db.add(obj)
    db.flush()
    db.refresh(obj)
    return obj


def register_service(db, clinic_id: int, specialty_id: int, name: str, price) -> Service:
    obj = Service(clinic_id=clinic_id, specialty_id=specialty_id, name=name, price=price)
    db.add(obj)
    db.flush()
    db.refresh(obj)
    return obj


def register_doctor_service(db, doctor_id: int, service_id: int) -> DoctorService:
    obj = DoctorService(doctor_id=doctor_id, service_id=service_id)
    db.add(obj)
    db.flush()
    db.refresh(obj)
    return obj


def register_doctor_schedule_config(db, doctor_id: int, **kwargs) -> DoctorScheduleConfig:
    obj = DoctorScheduleConfig(doctor_id=doctor_id, **kwargs)
    db.add(obj)
    db.flush()
    db.refresh(obj)
    return obj


def register_doctor_schedule_slot(db, doctor_id: int, **kwargs) -> DoctorScheduleSlot:
    obj = DoctorScheduleSlot(doctor_id=doctor_id, **kwargs)
    db.add(obj)
    db.flush()
    db.refresh(obj)
    return obj


def register_patient(db, person_id: int, **kwargs) -> Patient:
    # Patient não herda mais de Person: é uma tabela de extensão simples,
    # com id = FK para person.id. Como não faz parte da cadeia de
    # joined-table inheritance de Entity, dá pra usar o ORM normal aqui
    # (sem precisar do truque de insert() Core do exemplo antigo).
    obj = Patient(id=person_id, **kwargs)
    db.add(obj)
    db.flush()
    db.refresh(obj)
    return obj


def register_patient_access(db, patient_id: int, email: str, password: str) -> PatientAccess:
    obj = PatientAccess(
        patient_id=patient_id,
        email=email,
        password_hash=hash_password(password),
    )
    db.add(obj)
    db.flush()
    db.refresh(obj)
    return obj


def seed(db):
    # ---------------------------------------------------------------
    # 1) ADDRESS
    # ---------------------------------------------------------------
    addr_clinic = register_address(
        db,
        state="SP", city="São Paulo", neighborhood="Centro",
        street="Rua das Clínicas", number="100", complement=None, cep="01000000",
    )
    addr_doctor = register_address(
        db,
        state="SP", city="São Paulo", neighborhood="Jardins",
        street="Rua dos Médicos", number="200", complement="Apto 10", cep="01100000",
    )
    addr_recepcao = register_address(
        db,
        state="SP", city="São Paulo", neighborhood="Vila Nova",
        street="Rua da Recepção", number="300", complement=None, cep="01200000",
    )
    addr_admin = register_address(
        db,
        state="SP", city="São Paulo", neighborhood="Bela Vista",
        street="Rua da Administração", number="400", complement=None, cep="01300000",
    )
    addr_patient = register_address(
        db,
        state="SP", city="São Paulo", neighborhood="Liberdade",
        street="Rua dos Pacientes", number="500", complement=None, cep="01400000",
    )

    # ---------------------------------------------------------------
    # 2) PERSON (entity.id gerado automaticamente e reaproveitado)
    # ---------------------------------------------------------------
    person_doctor = register_person(
        db, address_id=addr_doctor.id,
        name="Dr. Joao Silva", cpf=CPF_FOR_TESTS[0], sex="M", birthday=date(1980, 5, 10),
    )
    person_recepcao = register_person(
        db, address_id=addr_recepcao.id,
        name="Maria Recepcao", cpf=CPF_FOR_TESTS[1], sex="F", birthday=date(1990, 3, 15),
    )
    person_admin = register_person(
        db, address_id=addr_admin.id,
        name="Carlos Administrador", cpf=CPF_FOR_TESTS[2], sex="M", birthday=date(1975, 8, 20),
    )
    person_patient = register_person(
        db, address_id=addr_patient.id,
        name="Ana Paciente", cpf=CPF_FOR_TESTS[3], sex="F", birthday=date(1995, 11, 2),
    )

    # ---------------------------------------------------------------
    # 3) CLINIC (entity.id gerado automaticamente e reaproveitado)
    # ---------------------------------------------------------------
    clinic = register_clinic(
        db, address_id=addr_clinic.id,
        trade_name="Clinica Teste", legal_name="Clinica Teste LTDA",
        cnpj="11222333000181",
    )

    # ---------------------------------------------------------------
    # 4) PHONE
    # ---------------------------------------------------------------
    register_phone(db, entity_id=person_doctor.id, phone="11988887777", type_="mobile")
    register_phone(db, entity_id=person_recepcao.id, phone="11977776666", type_="mobile")
    register_phone(db, entity_id=person_admin.id, phone="11966665555", type_="mobile")
    register_phone(db, entity_id=person_patient.id, phone="11955554444", type_="mobile")
    register_phone(db, entity_id=clinic.id, phone="1130001111", type_="commercial")

    # ---------------------------------------------------------------
    # 5) CLINICAL_ACCESS (doctor / recepcao / administrador)
    # ---------------------------------------------------------------
    ca_doctor = register_clinical_access(
        db, clinic_id=clinic.id, person_id=person_doctor.id,
        email="dr.silva@clinicateste.com", password="Senha123!", role="doctor",
    )
    register_clinical_access(
        db, clinic_id=clinic.id, person_id=person_recepcao.id,
        email="recepcao@clinicateste.com", password="Senha123!", role="recepcao",
    )
    register_clinical_access(
        db, clinic_id=clinic.id, person_id=person_admin.id,
        email="admin@clinicateste.com", password="Senha123!", role="administrador",
    )

    # ---------------------------------------------------------------
    # 6) CLINIX_ACCESS (acesso de sistema - reaproveitando o admin)
    # ---------------------------------------------------------------
    register_clinix_access(
        db, person_id=person_admin.id,
        email="sysadmin@clinixsystem.com", password="Senha123!", role="admin",
    )

    # ---------------------------------------------------------------
    # 7) DOCTOR
    # ---------------------------------------------------------------
    doctor = register_doctor(db, clinical_access_id=ca_doctor.id, crm="CRM12345-SP")

    # ---------------------------------------------------------------
    # 8) MEDICAL_SPECIALTY
    # ---------------------------------------------------------------
    specialty = register_medical_specialty(db, name="Clinica Geral")

    # ---------------------------------------------------------------
    # 9) DOCTOR_SPECIALTY
    # ---------------------------------------------------------------
    register_doctor_specialty(db, doctor_id=doctor.id, specialty_id=specialty.id)

    # ---------------------------------------------------------------
    # 10) SERVICE
    # ---------------------------------------------------------------
    service = register_service(
        db, clinic_id=clinic.id, specialty_id=specialty.id,
        name="Consulta Clinica Geral", price=150.00,
    )

    # ---------------------------------------------------------------
    # 11) DOCTOR_SERVICE
    # ---------------------------------------------------------------
    register_doctor_service(db, doctor_id=doctor.id, service_id=service.id)

    # ---------------------------------------------------------------
    # 12) DOCTOR_SCHEDULE_CONFIG
    # ---------------------------------------------------------------
    register_doctor_schedule_config(
        db, doctor_id=doctor.id,
        weekdays="1,2,3,4,5",  # segunda a sexta
        start_time=time(8, 0),
        end_time=time(18, 0),
        slot_duration=30,
        months_ahead=3,
    )

    # ---------------------------------------------------------------
    # 13) DOCTOR_SCHEDULE_SLOT
    # ---------------------------------------------------------------
    slot_start = (datetime.now(timezone.utc) + timedelta(days=1)).replace(
        hour=9, minute=0, second=0, microsecond=0
    )
    slot_end = slot_start + timedelta(minutes=30)
    register_doctor_schedule_slot(
        db, doctor_id=doctor.id,
        start_datetime=slot_start,
        end_datetime=slot_end,
        status="available",
    )

    # ---------------------------------------------------------------
    # 14) PATIENT (FK simples pra person.id, sem herança)
    # ---------------------------------------------------------------
    patient = register_patient(db, person_id=person_patient.id, is_active=True)

    # ---------------------------------------------------------------
    # 15) PATIENT_ACCESS
    # ---------------------------------------------------------------
    patient_access = register_patient_access(
        db, patient_id=patient.id,
        email="ana.paciente@teste.com", password="Senha123!",
    )

    return {
        "clinic_id": clinic.id,
        "doctor_id": doctor.id,
        "doctor_clinical_access_id": ca_doctor.id,
        "specialty_id": specialty.id,
        "service_id": service.id,
        "patient_id": patient.id,
        "patient_access_id": patient_access.id,
    }


def main():
    db = SessionLocal()
    try:
        with db.begin():
            result = seed(db)
        print("Seed concluido com sucesso!")
        print(result)
    except Exception as e:
        print("ERRO ao popular o banco:", e)
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()