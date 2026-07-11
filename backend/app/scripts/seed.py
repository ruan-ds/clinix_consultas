"""
Script de seed EXPANDIDO para popular o banco com um cenário completo de teste.

O que este script NÃO cria (conforme solicitado):
    - medical_appointment
    - logs
    - dependent

O que ele cria (respeitando a ordem de FKs):
    1. address                 (uma por pessoa + uma por clínica)
    2. person + entity         (15 médicos, 2 recepções, 2 administradores, 3 pacientes)
    3. clinic + entity         (2 clínicas: Central e Norte)
    4. phone                   (uma por entity: toda pessoa + toda clínica)
    5. clinical_access         (role='doctor' x15, role='recepcao' x2, role='administrador' x2)
    6. clinix_access           (acesso de sistema, reaproveitando um dos administradores)
    7. doctor                  (15 médicos)
    8. medical_specialty       (10 especialidades)
    9. doctor_specialty        (1-3 especialidades por médico)
   10. service                 (múltiplos serviços por combinação clínica+especialidade)
   11. doctor_service          (cada médico vinculado aos serviços da sua especialidade/clínica)
   12. doctor_schedule_config  (horário comercial + tarde por médico)
   13. doctor_schedule_slot    (agenda: TODOS os dias úteis do mês por médico,
                                 blocos de 1h: horário comercial 09:00-17:00 + tarde 14:00-20:00)
   14. patient                 (Patient FK simples pra person.id)
   15. patient_access

REGRAS DA AGENDA:
    - Horizonte de 30 dias (1 mês completo) a partir de amanhã.
    - Cada médico recebe slots em TODOS os dias úteis dentro do horizonte.
    - Horário comercial: 09h-17h (8 blocos de 1h).
    - Horário tardes: 14h-20h (6 blocos de 1h, sobrepondo parcialmente).
    - Médicos com perfil "tarde" atendem das 14h às 20h.

IMPORTANTE:
    - Usa `SessionLocal` de `app.core.database` (sessionmaker puro, sem dependência
      de request), então dá pra instanciar direto num script standalone.
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
    "45612378965",
    "32165498710",
    "65478932198",
    "78932165401",
    "14725836904",
    "25836914705",
    "36914725806",
    "85296314707",
    "96385274108",
    "15975385209",
    "75395145610",
]

# Configurações de horário
BUSINESS_START_HOUR = 9
BUSINESS_MORNING_END_HOUR = 17  # 17h - 9h = 8 blocos de 1h (manhã)
AFTERNOON_START_HOUR = 14
AFTERNOON_END_HOUR = 20  # 20h - 14h = 6 blocos de 1h (tarde/noite)
SLOT_DURATION_MINUTES = 60
SCHEDULE_HORIZON_DAYS = 30  # 1 mês completo


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
    number = f"119{80000000 + seq:08d}"
    return register_phone(db, entity_id=entity_id, phone=number, type_=type_)


def business_days_within(start: date, horizon_days: int) -> list[date]:
    """Retorna TODOS os dias úteis (seg-sex) dentro de `horizon_days` dias a partir de `start`."""
    days = []
    cursor = start + timedelta(days=1)
    end = start + timedelta(days=horizon_days)
    while cursor <= end:
        if cursor.isoweekday() <= 5:  # 1=segunda ... 5=sexta
            days.append(cursor)
        cursor += timedelta(days=1)
    return days


def morning_slots(day: date) -> list[tuple[datetime, datetime]]:
    """Gera blocos de 1h no período da manhã (09h-17h = 8 blocos)."""
    slots = []
    for hour in range(BUSINESS_START_HOUR, BUSINESS_MORNING_END_HOUR):
        start = datetime.combine(day, time(hour, 0), tzinfo=timezone.utc)
        end = start + timedelta(minutes=SLOT_DURATION_MINUTES)
        slots.append((start, end))
    return slots


def afternoon_slots(day: date) -> list[tuple[datetime, datetime]]:
    """Gera blocos de 1h no período da tarde/noite (14h-20h = 6 blocos)."""
    slots = []
    for hour in range(AFTERNOON_START_HOUR, AFTERNOON_END_HOUR):
        start = datetime.combine(day, time(hour, 0), tzinfo=timezone.utc)
        end = start + timedelta(minutes=SLOT_DURATION_MINUTES)
        slots.append((start, end))
    return slots


# ---------------------------------------------------------------------------
# DADOS DO CENÁRIO EXPANDIDO
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

# 10 Especialidades médicas
SPECIALTIES_DATA = [
    "Clinica Geral",
    "Cardiologia",
    "Dermatologia",
    "Pediatria",
    "Ortopedia",
    "Neurologia",
    "Ginecologia",
    "Endocrinologia",
    "Oftalmologia",
    "Psiquiatria",
]

# 15 Médicos distribuídos pelas clínicas e especialidades
DOCTORS_DATA = [
    # --- Clínica Central ---
    {
        "cpf_idx": 0, "name": "Dr. Joao Silva", "sex": "M", "birthday": date(1980, 5, 10),
        "clinic": "central", "specialty": "Clinica Geral", "crm": "CRM11111-SP",
        "email": "dr.silva@clinicateste.com", "schedule": "morning",
    },
    {
        "cpf_idx": 1, "name": "Dra. Beatriz Cardoso", "sex": "F", "birthday": date(1978, 2, 14),
        "clinic": "central", "specialty": "Cardiologia", "crm": "CRM22222-SP",
        "email": "beatriz.cardoso@clinicateste.com", "schedule": "morning",
    },
    {
        "cpf_idx": 5, "name": "Dr. Lucas Almeida", "sex": "M", "birthday": date(1983, 11, 8),
        "clinic": "central", "specialty": "Cardiologia", "crm": "CRM22223-SP",
        "email": "lucas.almeida@clinicateste.com", "schedule": "afternoon",
    },
    {
        "cpf_idx": 10, "name": "Dra. Camila Santos", "sex": "F", "birthday": date(1988, 4, 25),
        "clinic": "central", "specialty": "Dermatologia", "crm": "CRM33334-SP",
        "email": "camila.santos@clinicateste.com", "schedule": "morning",
    },
    {
        "cpf_idx": 4, "name": "Dr. Rafael Ortopedista", "sex": "M", "birthday": date(1982, 9, 5),
        "clinic": "central", "specialty": "Ortopedia", "crm": "CRM55555-SP",
        "email": "rafael.ortopedista@clinicateste.com", "schedule": "afternoon",
    },
    {
        "cpf_idx": 11, "name": "Dr. Pedro Neuro", "sex": "M", "birthday": date(1975, 6, 12),
        "clinic": "central", "specialty": "Neurologia", "crm": "CRM66666-SP",
        "email": "pedro.neuro@clinicateste.com", "schedule": "morning",
    },
    {
        "cpf_idx": 12, "name": "Dra. Renata Gineco", "sex": "F", "birthday": date(1986, 8, 17),
        "clinic": "central", "specialty": "Ginecologia", "crm": "CRM77777-SP",
        "email": "renata.gineco@clinicateste.com", "schedule": "morning",
    },
    {
        "cpf_idx": 13, "name": "Dr. Thiago Endocrino", "sex": "M", "birthday": date(1989, 1, 22),
        "clinic": "central", "specialty": "Endocrinologia", "crm": "CRM88888-SP",
        "email": "thiago.endocrino@clinicateste.com", "schedule": "afternoon",
    },
    # --- Clínica Norte ---
    {
        "cpf_idx": 2, "name": "Dr. Marcos Dermato", "sex": "M", "birthday": date(1985, 7, 22),
        "clinic": "norte", "specialty": "Dermatologia", "crm": "CRM33333-SP",
        "email": "marcos.dermato@clinicateste.com", "schedule": "morning",
    },
    {
        "cpf_idx": 3, "name": "Dra. Fernanda Pediatra", "sex": "F", "birthday": date(1990, 1, 30),
        "clinic": "norte", "specialty": "Pediatria", "crm": "CRM44444-SP",
        "email": "fernanda.pediatra@clinicateste.com", "schedule": "morning",
    },
    {
        "cpf_idx": 6, "name": "Dr. Gabriel Pediatra", "sex": "M", "birthday": date(1992, 3, 14),
        "clinic": "norte", "specialty": "Pediatria", "crm": "CRM44445-SP",
        "email": "gabriel.pediatra@clinicateste.com", "schedule": "afternoon",
    },
    {
        "cpf_idx": 7, "name": "Dr. Ricardo Neuro", "sex": "M", "birthday": date(1980, 10, 3),
        "clinic": "norte", "specialty": "Neurologia", "crm": "CRM66667-SP",
        "email": "ricardo.neuro@clinicateste.com", "schedule": "afternoon",
    },
    {
        "cpf_idx": 8, "name": "Dra. Patricia Gineco", "sex": "F", "birthday": date(1987, 5, 28),
        "clinic": "norte", "specialty": "Ginecologia", "crm": "CRM77778-SP",
        "email": "patricia.gineco@clinicateste.com", "schedule": "afternoon",
    },
    {
        "cpf_idx": 9, "name": "Dr. Vinicius Oftalmo", "sex": "M", "birthday": date(1984, 12, 9),
        "clinic": "norte", "specialty": "Oftalmologia", "crm": "CRM99999-SP",
        "email": "vinicius.oftalmo@clinicateste.com", "schedule": "morning",
    },
    {
        "cpf_idx": 14, "name": "Dra. Aline Psiquiatria", "sex": "F", "birthday": date(1991, 7, 6),
        "clinic": "norte", "specialty": "Psiquiatria", "crm": "CRM00001-SP",
        "email": "aline.psiquiatria@clinicateste.com", "schedule": "morning",
    },
]

RECEPTIONS_DATA = [
    {"cpf_idx": 15, "name": "Maria Recepcao", "sex": "F", "birthday": date(1990, 3, 15),
     "clinic": "central", "email": "recepcao.central@clinicateste.com"},
    {"cpf_idx": 16, "name": "Julia Recepcao", "sex": "F", "birthday": date(1992, 6, 18),
     "clinic": "norte", "email": "recepcao.norte@clinicateste.com"},
]

ADMINS_DATA = [
    {"cpf_idx": 17, "name": "Carlos Administrador", "sex": "M", "birthday": date(1975, 8, 20),
     "clinic": "central", "email": "admin.central@clinicateste.com", "is_system_admin": True},
    {"cpf_idx": 18, "name": "Paulo Administrador", "sex": "M", "birthday": date(1979, 12, 1),
     "clinic": "norte", "email": "admin.norte@clinicateste.com", "is_system_admin": False},
]

# 3 Pacientes de teste
PATIENTS_DATA = [
    {"cpf_idx": 19, "name": "Ana Paciente", "sex": "F", "birthday": date(1995, 11, 2),
     "email": "ana.paciente@teste.com"},
    {"cpf_idx": 20, "name": "Bruno Paciente", "sex": "M", "birthday": date(1988, 4, 15),
     "email": "bruno.paciente@teste.com"},
]

DEFAULT_PASSWORD = "Senha123!"

# ---------------------------------------------------------------------------
# Serviços por especialidade (serviços realistas de clínica)
# ---------------------------------------------------------------------------

SERVICES_BY_SPECIALTY = {
    "Clinica Geral": [
        ("Consulta Medica", 150.00),
        ("Check-up Geral", 350.00),
        ("Atestado Medico", 50.00),
        ("Retorno", 80.00),
    ],
    "Cardiologia": [
        ("Consulta Cardiologica", 250.00),
        ("MAPA 24h — Hipertensao Arterial Sistemica", 380.00),
        ("Holter 24h — Monitoramento Eletrico do Coracao", 420.00),
        ("Eletrocardiograma (ECG) de Repouso", 120.00),
        ("Ecocardiograma Transtoracico", 550.00),
        ("Teste Ergometrico (Esteira)", 480.00),
        ("Ecocardiograma com Doppler Colorido", 650.00),
    ],
    "Dermatologia": [
        ("Consulta Dermatologica", 220.00),
        ("Criocirurgia (lesoes)", 180.00),
        ("Bipsia de Pele", 350.00),
        ("Dermatoscopia Digital", 280.00),
        ("Retorno", 80.00),
    ],
    "Pediatria": [
        ("Consulta Pediatrica", 200.00),
        ("Acompanhamento de Crescimento e Desenvolvimento", 250.00),
        ("Orientacao Vacinal", 100.00),
        ("Ultrassom Pediatrico", 400.00),
        ("Retorno", 80.00),
    ],
    "Ortopedia": [
        ("Consulta Ortopedica", 250.00),
        ("Infiltracao Articular", 550.00),
        ("Exame de Funcao Articular", 300.00),
        ("Retorno", 80.00),
    ],
    "Neurologia": [
        ("Consulta Neurologica", 300.00),
        ("Eletroencefalograma (EEG)", 450.00),
        ("Acompanhamento de Enxaqueca", 250.00),
        ("Exame Neuropsicologico", 600.00),
        ("Retorno", 100.00),
    ],
    "Ginecologia": [
        ("Consulta Ginecologica", 230.00),
        ("Papanicolau", 150.00),
        ("Colposcopia", 380.00),
        ("Ultrassom Transvaginal", 420.00),
        ("Ultrassom Mamario", 400.00),
        ("Retorno", 80.00),
    ],
    "Endocrinologia": [
        ("Consulta Endocrinologica", 280.00),
        ("Acompanhamento de Diabetes", 250.00),
        ("Avaliacao de Tireoide", 300.00),
        ("Dosagens Hormonais", 350.00),
        ("Retorno", 100.00),
    ],
    "Oftalmologia": [
        ("Consulta Oftalmologica", 250.00),
        ("Exame de Vista / Refracaometria", 150.00),
        ("Mapeamento de Retina", 280.00),
        ("Tonometria (Pressao Intraocular)", 120.00),
        ("Campimetria Computadorizada", 320.00),
        ("Retorno", 80.00),
    ],
    "Psiquiatria": [
        ("Consulta Psiquiatrica", 350.00),
        ("Avaliacao Psiquiatrica Completa", 500.00),
        ("Acompanhamento Terapeutico", 300.00),
        ("Reajuste de Medicacao", 250.00),
        ("Retorno", 120.00),
    ],
}


def seed(db):
    addr_seq = 0
    phone_seq = 0

    # ---------------------------------------------------------------
    # 1) CLINIC ADDRESSES + CLINICS
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
    # 3) DOCTORS
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
            "schedule": d.get("schedule", "morning"),
        })

    # ---------------------------------------------------------------
    # 4) SERVICES + DOCTOR_SERVICE
    #    Para cada especialidade de cada clínica, cria todos os serviços
    #    daquela especialidade. Cada médico é vinculado a todos os serviços
    #    da sua especialidade na clínica onde atua.
    # ---------------------------------------------------------------
    services_cache = {}  # (clinic_id, specialty_id, service_name) -> Service

    for entry in doctors:
        clinic = entry["clinic"]
        specialty = entry["specialty"]
        specialty_name = specialty.name

        # Se não existem serviços para essa combinação, cria todos
        if (clinic.id, specialty.id) not in services_cache:
            specialty_services = SERVICES_BY_SPECIALTY.get(specialty_name, [("Consulta", 150.00)])
            for svc_name, svc_price in specialty_services:
                key = (clinic.id, specialty.id, svc_name)
                services_cache[key] = register_service(
                    db, clinic_id=clinic.id, specialty_id=specialty.id,
                    name=svc_name, price=svc_price,
                )
            # Marca que já registramos serviços para essa combinação
            services_cache[(clinic.id, specialty.id)] = True

        # Vincula o médico a todos os serviços da sua especialidade/clínica
        for key, service_obj in services_cache.items():
            if isinstance(service_obj, Service) and key[0] == clinic.id and key[1] == specialty.id:
                register_doctor_service(db, doctor_id=entry["doctor"].id, service_id=service_obj.id)

    # ---------------------------------------------------------------
    # 5) RECEPÇÕES
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
    # 6) ADMINISTRADORES
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
    #    Horizonte de 30 dias (1 mês), TODOS os dias úteis.
    #    Médicos com schedule='morning': 09h-17h (8 blocos).
    #    Médicos com schedule='afternoon': 14h-20h (6 blocos).
    # ---------------------------------------------------------------
    scheduled_days = business_days_within(date.today(), SCHEDULE_HORIZON_DAYS)

    for entry in doctors:
        doctor = entry["doctor"]
        schedule_type = entry["schedule"]

        if schedule_type == "afternoon":
            start_time = time(AFTERNOON_START_HOUR, 0)
            end_time = time(AFTERNOON_END_HOUR, 0)
            slot_generator = afternoon_slots
        else:  # morning (default)
            start_time = time(BUSINESS_START_HOUR, 0)
            end_time = time(BUSINESS_MORNING_END_HOUR, 0)
            slot_generator = morning_slots

        register_doctor_schedule_config(
            db, doctor_id=doctor.id,
            weekdays="1,2,3,4,5",  # segunda a sexta
            start_time=start_time,
            end_time=end_time,
            slot_duration=SLOT_DURATION_MINUTES,
            months_ahead=2,
        )

        all_slots = []
        for day in scheduled_days:
            all_slots.extend(slot_generator(day))

        register_doctor_schedule_slots_bulk(db, doctor_id=doctor.id, slots=all_slots)

    # ---------------------------------------------------------------
    # 8) PATIENTS + PATIENT_ACCESS
    # ---------------------------------------------------------------
    for pt in PATIENTS_DATA:
        addr = next_address(db, addr_seq, "Liberdade", "Rua dos Pacientes", 500 + addr_seq)
        addr_seq += 1
        patient_person = register_person(
            db, address_id=addr.id,
            name=pt["name"], cpf=CPF_FOR_TESTS[pt["cpf_idx"]],
            sex=pt["sex"], birthday=pt["birthday"],
        )
        next_phone(db, entity_id=patient_person.id, seq=phone_seq, type_="mobile")
        phone_seq += 1

        patient = register_patient(db, person_id=patient_person.id, is_active=True)
        register_patient_access(
            db, patient_id=patient.id,
            email=pt["email"], password=DEFAULT_PASSWORD,
        )

    return {
        "clinics": {key: c.id for key, c in clinics.items()},
        "specialties": {name: s.id for name, s in specialties.items()},
        "doctors": {entry["name"]: entry["doctor"].id for entry in doctors},
        "scheduled_days": [d.isoformat() for d in scheduled_days],
        "slots_per_morning_doctor": len(scheduled_days) * (BUSINESS_MORNING_END_HOUR - BUSINESS_START_HOUR),
        "slots_per_afternoon_doctor": len(scheduled_days) * (AFTERNOON_END_HOUR - AFTERNOON_START_HOUR),
        "total_days": len(scheduled_days),
        "total_patients": len(PATIENTS_DATA),
        "total_services": sum(len(svcs) for svcs in SERVICES_BY_SPECIALTY.values()),
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
