from sqlalchemy.orm import Session

from app.exceptions.clinical_exceptions import doctor_profile_not_found_error
from app.models.clinical_access import ClinicalAccess
from app.models.doctor import Doctor
from app.models.patient_medical_record import PatientMedicalRecord
from app.schemas.patient_medical_record import OutPatientMedicalRecord, UpdatePatientMedicalRecord


def get_or_create_medical_record_service(
    db: Session,
    clinical_access: ClinicalAccess,
    patient_id: int,
) -> OutPatientMedicalRecord:
    doctor = db.query(Doctor).filter(Doctor.clinical_access_id == clinical_access.id).first()
    if not doctor:
        doctor_profile_not_found_error()

    record = (
        db.query(PatientMedicalRecord)
        .filter(
            PatientMedicalRecord.patient_id == patient_id,
            PatientMedicalRecord.clinic_id == clinical_access.clinic_id,
            PatientMedicalRecord.is_active == True,
        )
        .first()
    )

    if not record:
        record = PatientMedicalRecord(
            patient_id=patient_id,
            clinic_id=clinical_access.clinic_id,
            observations=None,
        )
        db.add(record)
        db.commit()
        db.refresh(record)

    return record


def update_medical_record_service(
    db: Session,
    clinical_access: ClinicalAccess,
    patient_id: int,
    data: UpdatePatientMedicalRecord,
) -> OutPatientMedicalRecord:
    doctor = db.query(Doctor).filter(Doctor.clinical_access_id == clinical_access.id).first()
    if not doctor:
        doctor_profile_not_found_error()

    record = (
        db.query(PatientMedicalRecord)
        .filter(
            PatientMedicalRecord.patient_id == patient_id,
            PatientMedicalRecord.clinic_id == clinical_access.clinic_id,
            PatientMedicalRecord.is_active == True,
        )
        .first()
    )

    if not record:
        record = PatientMedicalRecord(
            patient_id=patient_id,
            clinic_id=clinical_access.clinic_id,
            observations=data.observations,
        )
        db.add(record)
    else:
        record.observations = data.observations
        db.add(record)

    db.commit()
    db.refresh(record)

    return record