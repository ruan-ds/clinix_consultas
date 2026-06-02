from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

from app.schemas.patient_access import OutPatientAccess


class CreatePatientAppointment(BaseModel):
    clinic_id: int
    doctor_id: int
    slot_id: int
    service_id: Optional[int] = None
    clinical_access_id: Optional[int] = None
    notes: Optional[str] = None


class OutMedicalAppointment(BaseModel):
    id: int
    clinic_id: int
    doctor_id: int
    patient_id: int
    clinical_access_id: int
    service_id: int
    slot_id: int
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    is_active: bool
    model_config = ConfigDict(from_attributes=True)


class FeedValidation(BaseModel):
    patient: OutPatientAccess
    has_upcoming_appointments: bool
    next_appointment: Optional[OutMedicalAppointment] = None
    model_config = ConfigDict(from_attributes=True)


class AppointmentHistoryOut(BaseModel):
    id: int
    doctor_name: str
    clinic_name: str
    address: str
    status: str
    date: datetime
    specialty: str

    class Config:# Isso aí habilita a compatibilidade com objetos do SQLAlchemy 
        from_attributes = True
