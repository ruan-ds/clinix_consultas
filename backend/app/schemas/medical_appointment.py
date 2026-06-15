from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict

from app.schemas.patient_access import OutPatientAccessWithName


class OutClinic(BaseModel):
    id: int
    trade_name: str
    address: str
    model_config = ConfigDict(from_attributes=True)

class OutDoctor(BaseModel):
    id: int
    name: str
    specialty: str
    clinic_name: str
    clinical_access_id: int
    model_config = ConfigDict(from_attributes=True)

class OutSlotDay(BaseModel):
    date: str        
    label: str       
    slots: List["OutSlot"]

class OutSlot(BaseModel):
    id: int
    start_datetime: datetime
    end_datetime: datetime
    status: str
    model_config = ConfigDict(from_attributes=True)

OutSlotDay.model_rebuild()

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
    patient: OutPatientAccessWithName
    has_upcoming_appointments: bool
    next_appointment: Optional["AppointmentHistoryItem"] = None 
    model_config = ConfigDict(from_attributes=True)


class AppointmentHistoryItem(BaseModel):
    id: int
    doctor_name: str
    clinic_name: str
    address: str
    status: str
    date: datetime
    specialty: str

    model_config = ConfigDict(from_attributes=True)


class OutMyDoctor(BaseModel):
    id: int
    name: str
    specialty: str
    clinic: str
    location: str
    
    model_config = ConfigDict(from_attributes=True)
