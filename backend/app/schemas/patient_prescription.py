from datetime import datetime
from pydantic import BaseModel, ConfigDict


class PatientPrescriptionBase(BaseModel):
    prescription: str


class CreatePatientPrescription(BaseModel):
    patient_cpf: str
    prescription: str


class OutPatientPrescription(PatientPrescriptionBase):
    id: int
    patient_id: int
    patient_name: str
    patient_age: int
    created_at: datetime
    date_valid: datetime
    doctor_id: int
    doctor_name: str
    is_valid: bool

    model_config = ConfigDict(from_attributes=True)


class OutPrescriptionDetail(BaseModel):
    prescription_id: int
    patient_name: str
    patient_age: int
    doctor_name: str
    clinic_name: str
    created_at: datetime
    date_valid: datetime
    prescription: str

    model_config = ConfigDict(from_attributes=True)
