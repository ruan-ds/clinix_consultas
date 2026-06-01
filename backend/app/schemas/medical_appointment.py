from pydantic import BaseModel
from datetime import datetime

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
