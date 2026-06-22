from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db

from app.models.clinical_access import ClinicalAccess

from app.schemas.clinical_access import OutMeClinicalAccess
from app.schemas.medical_appointment import OutDoctorSchedule, UpdateAppointmentStatus
from app.schemas.medical_appointment import OutAttendedPatient
from app.schemas.medical_appointment import OutPatientAppointmentHistory
from app.schemas.patient_medical_record import OutPatientMedicalRecord, UpdatePatientMedicalRecord
from app.schemas.patient_prescription import CreatePatientPrescription, OutPatientPrescription, OutPrescriptionDetail

from app.services.clinical.clinical_services import get_current_clinical_user
from app.services.clinical.schedule import (
    get_doctor_schedule_service,
    update_appointment_status_service,
    get_attended_patients_history_service,
    get_single_patient_history_service,
)
from app.services.clinical.medical_record import (
    get_or_create_medical_record_service,
    update_medical_record_service,
)
from app.services.clinical.patient_prescription import (
    create_prescription_service,
    list_clinic_prescriptions_service,
    get_prescription_detail_service,
)


router = APIRouter(prefix="/clinical", tags=["Clinical"])


@router.get("/me", response_model=OutMeClinicalAccess)
def get_me(
    current_user: ClinicalAccess = Depends(get_current_clinical_user),
) -> OutMeClinicalAccess:
    return OutMeClinicalAccess(
        id=current_user.id,
        role=current_user.role,
        person_name=current_user.person.name,
    )


@router.get("/schedule", response_model=List[OutDoctorSchedule])
def get_schedule(
    current_user: ClinicalAccess = Depends(get_current_clinical_user),
    db: Session = Depends(get_db),
) -> List[OutDoctorSchedule]:
    return get_doctor_schedule_service(db=db, clinical_access=current_user)


@router.patch("/appointments/status", status_code=204)
def update_appointment_status(
    data: UpdateAppointmentStatus,
    current_user: ClinicalAccess = Depends(get_current_clinical_user),
    db: Session = Depends(get_db),
) -> None:
    update_appointment_status_service(
        db=db,
        clinical_access=current_user,
        appointment_id=data.appointment_id,
    )


@router.get("/patients/history", response_model=List[OutAttendedPatient])
def get_attended_patients_history(
    current_user: ClinicalAccess = Depends(get_current_clinical_user),
    db: Session = Depends(get_db),
) -> List[OutAttendedPatient]:
    return get_attended_patients_history_service(db=db, clinical_access=current_user)


@router.get("/patients/{patient_id}/history", response_model=List[OutPatientAppointmentHistory])
def get_single_patient_history(
    patient_id: int,
    current_user: ClinicalAccess = Depends(get_current_clinical_user),
    db: Session = Depends(get_db),
) -> List[OutPatientAppointmentHistory]:
    return get_single_patient_history_service(
        db=db, 
        clinical_access=current_user, 
        patient_id=patient_id
    )


@router.get("/patients/{patient_id}/medical-record", response_model=OutPatientMedicalRecord)
def get_or_create_medical_record(
    patient_id: int,
    current_user: ClinicalAccess = Depends(get_current_clinical_user),
    db: Session = Depends(get_db),
) -> OutPatientMedicalRecord:
    return get_or_create_medical_record_service(
        db=db, 
        clinical_access=current_user, 
        patient_id=patient_id
    )

@router.put("/patients/{patient_id}/medical-record", response_model=OutPatientMedicalRecord)
def update_medical_record(
    patient_id: int,
    data: UpdatePatientMedicalRecord,
    current_user: ClinicalAccess = Depends(get_current_clinical_user),
    db: Session = Depends(get_db),
) -> OutPatientMedicalRecord:
    return update_medical_record_service(
        db=db, 
        clinical_access=current_user, 
        patient_id=patient_id, 
        data=data
    )


@router.get("/prescriptions", response_model=List[OutPatientPrescription])
def list_clinic_prescriptions(
    current_user: ClinicalAccess = Depends(get_current_clinical_user),
    db: Session = Depends(get_db),
) -> List[OutPatientPrescription]:
    return list_clinic_prescriptions_service(db=db, clinical_access=current_user)


@router.post("/prescriptions", response_model=OutPatientPrescription)
def create_prescription(
    data: CreatePatientPrescription,
    current_user: ClinicalAccess = Depends(get_current_clinical_user),
    db: Session = Depends(get_db),
) -> OutPatientPrescription:
    return create_prescription_service(
        db=db, 
        clinical_access=current_user, 
        data=data
    )


@router.get("/prescriptions/{prescription_id}", response_model=OutPrescriptionDetail)
def get_prescription_detail(
    prescription_id: int,
    current_user: ClinicalAccess = Depends(get_current_clinical_user),
    db: Session = Depends(get_db),
) -> OutPrescriptionDetail:
    return get_prescription_detail_service(
        db=db, 
        clinical_access=current_user, 
        prescription_id=prescription_id
    )