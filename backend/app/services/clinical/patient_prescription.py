from datetime import datetime, timedelta, timezone, date
from sqlalchemy.orm import Session, joinedload
from app.models.clinical_access import ClinicalAccess
from app.models.doctor import Doctor
from app.models.patient_prescription import PatientPrescription
from app.schemas.patient_prescription import CreatePatientPrescription, OutPatientPrescription
from app.exceptions.clinical_exceptions import doctor_profile_not_found_error

def create_prescription_service(
    db: Session,
    clinical_access: ClinicalAccess,
    data: CreatePatientPrescription,
) -> OutPatientPrescription:
    doctor = db.query(Doctor).filter(Doctor.clinical_access_id == clinical_access.id).first()
    if not doctor:
        doctor_profile_not_found_error()

    # 1. Busca a pessoa pelo CPF
    person = db.query(Person).filter(Person.cpf == data.patient_cpf).first()
    if not person:
        patient_not_found_error()

    # 2. Busca o paciente vinculado a essa pessoa
    patient = db.query(Patient).filter(Patient.person_id == person.id).first()
    if not patient:
        patient_not_found_error()

    # 3. Valida se existe prontuário na clínica
    record = (
        db.query(PatientMedicalRecord)
        .filter(
            PatientMedicalRecord.patient_id == patient.id,
            PatientMedicalRecord.clinic_id == clinical_access.clinic_id,
        )
        .first()
    )
    if not record:
        medical_record_required_error()

    now = datetime.now(timezone.utc)

    prescription = PatientPrescription(
        patient_id=patient.id,
        clinic_id=clinical_access.clinic_id,
        doctor_id=doctor.id,
        prescription=data.prescription,
        created_at=now,
        date_valid=now + timedelta(days=90),
    )

    db.add(prescription)
    db.commit()
    db.refresh(prescription)

    # Carrega relacionamentos para o schema
    db.refresh(prescription, ["patient", "doctor"])

    return _build_out_prescription(prescription)


def list_clinic_prescriptions_service(
    db: Session,
    clinical_access: ClinicalAccess,
) -> list[OutPatientPrescription]:
    prescriptions = (
        db.query(PatientPrescription)
        .options(
            joinedload(PatientPrescription.patient).joinedload(lambda p: p.person),
            joinedload(PatientPrescription.doctor).joinedload(lambda d: d.clinical_access).joinedload(lambda ca: ca.person)
        )
        .filter(
            PatientPrescription.clinic_id == clinical_access.clinic_id
        )
        .order_by(PatientPrescription.created_at.desc())
        .all()
    )

    today = date.today()
    result = []

    for p in prescriptions:
        birth = p.patient.person.birthday
        age = today.year - birth.year - ((today.month, today.day) < (birth.month, birth.day))

        result.append(
            OutPatientPrescription(
                id=p.id,
                patient_id=p.patient_id,
                patient_name=p.patient.person.name,
                patient_age=age,
                created_at=p.created_at,
                date_valid=p.date_valid,
                doctor_id=p.doctor_id,
                doctor_name=p.doctor.person.name,
                prescription=p.prescription,
                is_valid=p.is_valid
            )
        )

    return result


def get_prescription_detail_service(
    db: Session,
    clinical_access: ClinicalAccess,
    prescription_id: int,
) -> OutPrescriptionDetail:
    prescription = (
        db.query(PatientPrescription)
        .options(
            joinedload(PatientPrescription.patient).joinedload(lambda p: p.person),
            joinedload(PatientPrescription.doctor).joinedload(lambda d: d.clinical_access).joinedload(lambda ca: ca.person),
            joinedload(PatientPrescription.clinic),
        )
        .filter(
            PatientPrescription.id == prescription_id,
            PatientPrescription.clinic_id == clinical_access.clinic_id,
        )
        .first()
    )

    if not prescription:
        prescription_not_found_error()

    return OutPrescriptionDetail(
        prescription_id=prescription.id,
        patient_name=prescription.patient.person.name,
        patient_age=_calculate_age(prescription.patient.person.birthday),
        doctor_name=prescription.doctor.person.name,
        clinic_name=prescription.clinic.trade_name,
        created_at=prescription.created_at,
        date_valid=prescription.date_valid,
        prescription=prescription.prescription,
    )