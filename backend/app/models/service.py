from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    ForeignKey,
    Boolean
)
from app.core.base_model import Base


class Service(Base):
    __tablename__ = "service"

    id = Column(Integer, primary_key=True)
    clinic_id = Column(Integer, ForeignKey("clinic.id"), nullable=False)
    name = Column(String(100), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    is_active = Column(Boolean, default=True)

    clinic = relationship("Clinic", back_populates="services")
    medical_appointments = relationship("MedicalAppointment", back_populates="service")
