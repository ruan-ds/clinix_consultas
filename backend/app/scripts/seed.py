"""
Script de seed para popular o banco com um cenário mais completo de teste.

O que este script NÃO cria (conforme solicitado):
    - medical_appointment
    - logs
    - dependent

O que ele cria (respeitando a ordem de FKs):
    1. address                 (uma por pessoa + uma por clínica)
    2. person + entity         (5 médicos, 2 recepções, 2 administradores, 1 paciente)
                                 entity.id é gerado automaticamente e reaproveitado em
                                 person.id (joined-table inheritance: Entity -> Person).
    3. clinic + entity         (2 clínicas: Central e Norte)
    4. phone                   (uma por entity: toda pessoa + toda clínica)
    5. clinical_access         (role='doctor' x5, role='recepcao' x2, role='administrador' x2)
    6. clinix_access           (acesso de sistema, reaproveitando um dos administradores)
    7. doctor                  (5 médicos, um deles é o Dr. Joao Silva)
    8. medical_specialty       (5 especialidades)
    9. doctor_specialty        (1 especialidade por médico)
   10. service                 (1 serviço por combinação clínica+especialidade usada)
   11. doctor_service          (cada médico vinculado ao serviço da sua especialidade/clínica)
   12. doctor_schedule_config  (horário comercial padrão por médico)
   13. doctor_schedule_slot    (agenda: 10 dias úteis dentro dos próximos 30 dias por médico,
                                 8 blocos de 1h/dia -> horário comercial 09:00-17:00)
   14. patient                 (Patient não herda mais de Person, é FK simples pra person.id)
   15. patient_access

REGRAS DA AGENDA:
    - Horizonte de 30 dias a partir de amanhã.
    - Dentro desse horizonte, cada médico recebe slots em 10 dias úteis (seg-sex).
    - Cada dia útil tem no máximo 8 blocos de 1 hora (09h-17h, horário comercial padrão).

IMPORTANTE:
    - Usa `SessionLocal` de `app.core.database` (sessionmaker puro, sem dependência
      de request), então dá pra instanciar direto num script standalone.
    - Não me preocupei com a conexão em si, só com a ordem de criação/commit.
    - Rode com:  poetry run python -m app.scripts.seed
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

# Horário comercial padrão usado tanto no doctor_schedule_config quanto na
# geração manual dos slots.
BUSINESS_START_HOUR = 9
BUSINESS_END_HOUR = 17  # 17h - 9h = 8 blocos de 1h, respeitando o máximo de 8/dia
SLOT_DURATION_MINUTES = 60
SCHEDULE_HORIZON_DAYS = 30
BUSINESS_DAYS_PER_DOCTOR = 10


# ---------------------------------------------------------------------------
# Funções de registro (uma por tabela)
# ---------------------------------------------------------------------------

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


def register_doctor_schedule_slots_bulk(db, doctor_id: int, slots: list[tuple[datetime, datetime]]) -> list[DoctorScheduleSlot]:
    objs = [
        DoctorScheduleSlot(doctor_id=doctor_id, start_datetime=start, end_datetime=end, status="available")
        for start, end in slots
    ]
    db.add_all(objs)
    db.flush()
    return objs


def register_patient(db, person_id: int, **kwargs) -> Patient:
    # Patient não herda mais de Person: é uma tabela de extensão simples,
    # com id = FK para person.id. Não faz parte da cadeia de joined-table
    # inheritance de Entity, então dá pra usar o ORM normal aqui.
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


# ---------------------------------------------------------------------------
# Helpers de geração de dados fake determinísticos
# ---------------------------------------------------------------------------

def next_address(db, seq: int, neighborhood: str, street: str, number: int) -> Address:
    return register_address(
        db,
        state="SP", city="São Paulo", neighborhood=neighborhood,
        street=street, number=str(number), complement=None,
        cep=str(10000000 + seq).zfill(8),
    )


def next_phone(db, entity_id: int, seq: int, type_: str) -> Phone:
    # DDD (2) + 9 (1) + 8 dígitos = 11 caracteres
    number = f"119{80000000 + seq:08d}"
    return register_phone(db, entity_id=entity_id, phone=number, type_=type_)


def business_days_within(start: date, horizon_days: int, count: int) -> list[date]:
    """Retorna os primeiros `count` dias úteis (seg-sex) dentro de `horizon_days`
    dias a partir de `start` (exclusive)."""
    days = []
    cursor = start
    for _ in range(horizon_days):
        cursor = cursor + timedelta(days=1)
        if cursor.isoweekday() <= 5:  # 1=segunda ... 5=sexta
            days.append(cursor)
        if len(days) >= count:
            break
    return days


def business_hour_slots(day: date) -> list[tuple[datetime, datetime]]:
    """Gera os blocos de 1h em horário comercial padrão (09h-17h = 8 blocos)."""
    slots = []
    for hour in range(BUSINESS_START_HOUR, BUSINESS_END_HOUR):
        start = datetime.combine(day, time(hour, 0), tzinfo=timezone.utc)
        end = start + timedelta(minutes=SLOT_DURATION_MINUTES)
        slots.append((start, end))
    return slots


# ---------------------------------------------------------------------------
# Dados do cenário
# ---------------------------------------------------------------------------

CLINICS_DATA = [
    {
        "key": "central",
        "trade_name": "Clinica Central",
        "legal_name": "Clinica Central LTDA",
        "cnpj": "11222333000181",
        "neighborhood": "Centro",
        "street": "Rua das Clinicas",
        "number": 100,
    },
    {
        "key": "norte",
        "trade_name": "Clinica Norte",
        "legal_name": "Clinica Norte LTDA",
        "cnpj": "22333444000192",
        "neighborhood": "Zona Norte",
        "street": "Avenida Norte",
        "number": 900,
    },
]

SPECIALTIES_DATA = ["Clinica Geral", "Cardiologia", "Dermatologia", "Pediatria", "Ortopedia"]

DOCTORS_DATA = [
    {
        "cpf_idx": 0, "name": "Dr. Joao Silva", "sex": "M", "birthday": date(1980, 5, 10),
        "clinic": "central", "specialty": "Clinica Geral", "crm": "CRM11111-SP",
        "email": "dr.silva@clinicateste.com",
    },
    {
        "cpf_idx": 1, "name": "Dra. Beatriz Cardoso", "sex": "F", "birthday": date(1978, 2, 14),
        "clinic": "central", "specialty": "Cardiologia", "crm": "CRM22222-SP",
        "email": "beatriz.cardoso@clinicateste.com",
    },
    {
        "cpf_idx": 2, "name": "Dr. Marcos Dermato", "sex": "M", "birthday": date(1985, 7, 22),
        "clinic": "norte", "specialty": "Dermatologia", "crm": "CRM33333-SP",
        "email": "marcos.dermato@clinicateste.com",
    },
    {
        "cpf_idx": 3, "name": "Dra. Fernanda Pediatra", "sex": "F", "birthday": date(1990, 1, 30),
        "clinic": "norte", "specialty": "Pediatria", "crm": "CRM44444-SP",
        "email": "fernanda.pediatra@clinicateste.com",
    },
    {
        "cpf_idx": 4, "name": "Dr. Rafael Ortopedista", "sex": "M", "birthday": date(1982, 9, 5),
        "clinic": "central", "specialty": "Ortopedia", "crm": "CRM55555-SP",
        "email": "rafael.ortopedista@clinicateste.com",
    },
]

RECEPTIONS_DATA = [
    {"cpf_idx": 5, "name": "Maria Recepcao", "sex": "F", "birthday": date(1990, 3, 15),
     "clinic": "central", "email": "recepcao.central@clinicateste.com"},
    {"cpf_idx": 6, "name": "Julia Recepcao", "sex": "F", "birthday": date(1992, 6, 18),
     "clinic": "norte", "email": "recepcao.norte@clinicateste.com"},
]

ADMINS_DATA = [
    {"cpf_idx": 7, "name": "Carlos Administrador", "sex": "M", "birthday": date(1975, 8, 20),
     "clinic": "central", "email": "admin.central@clinicateste.com", "is_system_admin": True},
    {"cpf_idx": 8, "name": "Paulo Administrador", "sex": "M", "birthday": date(1979, 12, 1),
     "clinic": "norte", "email": "admin.norte@clinicateste.com", "is_system_admin": False},
]

PATIENT_DATA = {
    "cpf_idx": 9, "name": "Ana Paciente", "sex": "F", "birthday": date(1995, 11, 2),
    "email": "ana.paciente@teste.com",
}

DEFAULT_PASSWORD = "Senha123!"


def seed(db):
    addr_seq = 0
    phone_seq = 0

    # ---------------------------------------------------------------
    # 1) CLINIC ADDRESSES + CLINICS (entity.id gerado automaticamente)
    # ---------------------------------------------------------------
    clinics = {}
    for c in CLINICS_DATA:
        addr = next_address(db, addr_seq, c["neighborhood"], c["street"], c["number"])
        addr_seq += 1
        clinic = register_clinic(
            db, address_id=addr.id,
            trade_name=c["trade_name"], legal_name=c["legal_name"], cnpj=c["cnpj"],
        )
        next_phone(db, entity_id=clinic.id, seq=phone_seq, type_="commercial")
        phone_seq += 1
        clinics[c["key"]] = clinic

    # ---------------------------------------------------------------
    # 2) MEDICAL_SPECIALTY
    # ---------------------------------------------------------------
    specialties = {name: register_medical_specialty(db, name=name) for name in SPECIALTIES_DATA}

    # ---------------------------------------------------------------
    # 3) DOCTORS: person -> phone -> clinical_access -> doctor -> doctor_specialty
    # ---------------------------------------------------------------
    doctors = []
    for d in DOCTORS_DATA:
        addr = next_address(db, addr_seq, "Jardins", "Rua dos Medicos", 200 + addr_seq)
        addr_seq += 1
        person = register_person(
            db, address_id=addr.id,
            name=d["name"], cpf=CPF_FOR_TESTS[d["cpf_idx"]], sex=d["sex"], birthday=d["birthday"],
        )
        next_phone(db, entity_id=person.id, seq=phone_seq, type_="mobile")
        phone_seq += 1

        clinic = clinics[d["clinic"]]
        clinical_access = register_clinical_access(
            db, clinic_id=clinic.id, person_id=person.id,
            email=d["email"], password=DEFAULT_PASSWORD, role="doctor",
        )
        doctor = register_doctor(db, clinical_access_id=clinical_access.id, crm=d["crm"])

        specialty = specialties[d["specialty"]]
        register_doctor_specialty(db, doctor_id=doctor.id, specialty_id=specialty.id)

        doctors.append({
            "doctor": doctor,
            "clinic": clinic,
            "specialty": specialty,
            "name": d["name"],
        })

    # ---------------------------------------------------------------
    # 4) SERVICE (uma por combinação clínica+especialidade usada) + DOCTOR_SERVICE
    # ---------------------------------------------------------------
    services_cache = {}  # (clinic_id, specialty_id) -> Service
    for entry in doctors:
        clinic = entry["clinic"]
        specialty = entry["specialty"]
        key = (clinic.id, specialty.id)
        if key not in services_cache:
            services_cache[key] = register_service(
                db, clinic_id=clinic.id, specialty_id=specialty.id,
                name=f"Consulta {specialty.name}", price=150.00,
            )
        register_doctor_service(db, doctor_id=entry["doctor"].id, service_id=services_cache[key].id)

    # ---------------------------------------------------------------
    # 5) RECEPÇÕES: person -> phone -> clinical_access (role='recepcao')
    # ---------------------------------------------------------------
    for r in RECEPTIONS_DATA:
        addr = next_address(db, addr_seq, "Vila Nova", "Rua da Recepcao", 300 + addr_seq)
        addr_seq += 1
        person = register_person(
            db, address_id=addr.id,
            name=r["name"], cpf=CPF_FOR_TESTS[r["cpf_idx"]], sex=r["sex"], birthday=r["birthday"],
        )
        next_phone(db, entity_id=person.id, seq=phone_seq, type_="mobile")
        phone_seq += 1
        register_clinical_access(
            db, clinic_id=clinics[r["clinic"]].id, person_id=person.id,
            email=r["email"], password=DEFAULT_PASSWORD, role="recepcao",
        )

    # ---------------------------------------------------------------
    # 6) ADMINISTRADORES: person -> phone -> clinical_access (role='administrador')
    #    + clinix_access pro administrador marcado como is_system_admin
    # ---------------------------------------------------------------
    for a in ADMINS_DATA:
        addr = next_address(db, addr_seq, "Bela Vista", "Rua da Administracao", 400 + addr_seq)
        addr_seq += 1
        person = register_person(
            db, address_id=addr.id,
            name=a["name"], cpf=CPF_FOR_TESTS[a["cpf_idx"]], sex=a["sex"], birthday=a["birthday"],
        )
        next_phone(db, entity_id=person.id, seq=phone_seq, type_="mobile")
        phone_seq += 1
        register_clinical_access(
            db, clinic_id=clinics[a["clinic"]].id, person_id=person.id,
            email=a["email"], password=DEFAULT_PASSWORD, role="administrador",
        )
        if a["is_system_admin"]:
            register_clinix_access(
                db, person_id=person.id,
                email="sysadmin@clinixsystem.com", password=DEFAULT_PASSWORD, role="admin",
            )

    # ---------------------------------------------------------------
    # 7) DOCTOR_SCHEDULE_CONFIG + DOCTOR_SCHEDULE_SLOT
    #    Horizonte de 30 dias, 10 dias úteis por médico, 8 blocos de 1h/dia
    #    (horário comercial padrão 09h-17h).
    # ---------------------------------------------------------------
    scheduled_days = business_days_within(date.today(), SCHEDULE_HORIZON_DAYS, BUSINESS_DAYS_PER_DOCTOR)

    for entry in doctors:
        doctor = entry["doctor"]
        register_doctor_schedule_config(
            db, doctor_id=doctor.id,
            weekdays="1,2,3,4,5",  # segunda a sexta
            start_time=time(BUSINESS_START_HOUR, 0),
            end_time=time(BUSINESS_END_HOUR, 0),
            slot_duration=SLOT_DURATION_MINUTES,
            months_ahead=2,
        )

        all_slots = []
        for day in scheduled_days:
            all_slots.extend(business_hour_slots(day))

        register_doctor_schedule_slots_bulk(db, doctor_id=doctor.id, slots=all_slots)

    # ---------------------------------------------------------------
    # 8) PATIENT + PATIENT_ACCESS
    # ---------------------------------------------------------------
    addr = next_address(db, addr_seq, "Liberdade", "Rua dos Pacientes", 500 + addr_seq)
    addr_seq += 1
    patient_person = register_person(
        db, address_id=addr.id,
        name=PATIENT_DATA["name"], cpf=CPF_FOR_TESTS[PATIENT_DATA["cpf_idx"]],
        sex=PATIENT_DATA["sex"], birthday=PATIENT_DATA["birthday"],
    )
    next_phone(db, entity_id=patient_person.id, seq=phone_seq, type_="mobile")
    phone_seq += 1

    patient = register_patient(db, person_id=patient_person.id, is_active=True)
    patient_access = register_patient_access(
        db, patient_id=patient.id,
        email=PATIENT_DATA["email"], password=DEFAULT_PASSWORD,
    )

    return {
        "clinics": {key: c.id for key, c in clinics.items()},
        "specialties": {name: s.id for name, s in specialties.items()},
        "doctors": {entry["name"]: entry["doctor"].id for entry in doctors},
        "scheduled_days": [d.isoformat() for d in scheduled_days],
        "slots_per_doctor": len(scheduled_days) * (BUSINESS_END_HOUR - BUSINESS_START_HOUR),
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