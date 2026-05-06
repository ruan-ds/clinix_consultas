from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    String,
)
from app.core.base_model import Base


class Service(Base):
    __tablename__ = "service"

    id = Column(Integer, primary_key=True)
    role = Column(String(15), nullable=False)

    clinical_access = relationship("ClinicalAccess", back_populates="specialtie")
    medical_appointment = relationship("MedicalAppointment", back_populates="service")