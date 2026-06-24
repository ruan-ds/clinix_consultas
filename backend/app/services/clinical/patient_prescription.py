from datetime import date, datetime, timedelta, timezone

from sqlalchemy.orm import Session, joinedload

from app.exceptions.clinical_exceptions import doctor_profile_not_found_error
from app.models.clinical_access import ClinicalAccess
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.patient_medical_record import PatientMedicalRecord
from app.models.patient_prescription import PatientPrescription
from app.models.person import Person
from app.schemas.patient_prescription import CreatePatientPrescription, OutPatientPrescription, OutPrescriptionDetail


def patient_not_found_error() -> None:
    raise ValueError("Paciente não encontrado")


def medical_record_required_error() -> None:
    raise ValueError("Prontuário obrigatório para prescrever")


def prescription_not_found_error() -> None:
    raise ValueError("Prescrição não encontrada")


def _calculate_age(birthday: date) -> int:
    today = date.today()
    return today.year - birthday.year - ((today.month, today.day) < (birthday.month, birthday.day))


def _build_out_prescription(prescription: PatientPrescription) -> OutPatientPrescription:
    return OutPatientPrescription(
        id=prescription.id,
        patient_id=prescription.patient_id,
        patient_name=prescription.patient.name,
        patient_age=_calculate_age(prescription.patient.birthday),
        created_at=prescription.created_at,
        date_valid=prescription.date_valid,
        doctor_id=prescription.doctor_id,
        doctor_name=prescription.doctor.clinical_access.person.name,
        prescription=prescription.prescription,
        is_valid=prescription.is_valid,
    )


def create_prescription_service(
    db: Session,
    clinical_access: ClinicalAccess,
    data: CreatePatientPrescription,
) -> OutPatientPrescription:
    doctor = db.query(Doctor).filter(Doctor.clinical_access_id == clinical_access.id).first()
    if not doctor:
        doctor_profile_not_found_error()

    person = db.query(Person).filter(Person.cpf == data.patient_cpf).first()
    if not person:
        patient_not_found_error()

    patient = db.query(Patient).filter(Patient.id == person.id).first()
    if not patient:
        patient_not_found_error()

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

    prescription = (
        db.query(PatientPrescription)
        .options(
            joinedload(PatientPrescription.patient),
            joinedload(PatientPrescription.doctor).joinedload(Doctor.clinical_access).joinedload(ClinicalAccess.person),
        )
        .filter(PatientPrescription.id == prescription.id)
        .first()
    )
    if not prescription:
        prescription_not_found_error()

    return _build_out_prescription(prescription)


def list_clinic_prescriptions_service(
    db: Session,
    clinical_access: ClinicalAccess,
) -> list[OutPatientPrescription]:
    prescriptions = (
        db.query(PatientPrescription)
        .options(
            joinedload(PatientPrescription.patient),
            joinedload(PatientPrescription.doctor).joinedload(Doctor.clinical_access).joinedload(ClinicalAccess.person),
        )
        .filter(PatientPrescription.clinic_id == clinical_access.clinic_id)
        .order_by(PatientPrescription.created_at.desc())
        .all()
    )

    return [_build_out_prescription(prescription) for prescription in prescriptions]


def get_prescription_detail_service(
    db: Session,
    clinical_access: ClinicalAccess,
    prescription_id: int,
) -> OutPrescriptionDetail:
    prescription = (
        db.query(PatientPrescription)
        .options(
            joinedload(PatientPrescription.patient),
            joinedload(PatientPrescription.doctor).joinedload(Doctor.clinical_access).joinedload(ClinicalAccess.person),
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
        patient_name=prescription.patient.name,
        patient_age=_calculate_age(prescription.patient.birthday),
        doctor_name=prescription.doctor.clinical_access.person.name,
        clinic_name=prescription.clinic.trade_name,
        created_at=prescription.created_at,
        date_valid=prescription.date_valid,
        prescription=prescription.prescription,
    )
