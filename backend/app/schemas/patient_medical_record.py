from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class PatientMedicalRecordBase(BaseModel):
    observations: Optional[str] = None


class CreatePatientMedicalRecord(PatientMedicalRecordBase):
    patient_id: int
    clinic_id: int


class UpdatePatientMedicalRecord(PatientMedicalRecordBase):
    pass


class OutPatientMedicalRecord(PatientMedicalRecordBase):
    id: int
    patient_id: int
    clinic_id: int
    created_at: datetime
    updated_at: datetime
    is_active: bool

    model_config = ConfigDict(from_attributes=True)