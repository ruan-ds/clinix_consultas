from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    String,
    Numeric,
    ForeignKey,
    Boolean,
    UniqueConstraint
)
from app.core.base_model import Base


class Service(Base):
    __tablename__ = "service"

    id = Column(Integer, primary_key=True)
    clinic_id = Column(Integer, ForeignKey("clinic.id"), nullable=False, index=True)
    specialty_id = Column(Integer, ForeignKey("medical_specialty.id"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    is_active = Column(Boolean, default=True)

    clinic = relationship("Clinic", back_populates="services")
    medical_specialty = relationship("MedicalSpecialty", back_populates="services")
    medical_appointments = relationship("MedicalAppointment", back_populates="service")
    doctor_services = relationship("DoctorService", back_populates="service")

    __table_args__ = (
        UniqueConstraint(
            "clinic_id",
            "specialty_id",
            "name",
            name="uq_service_clinic_specialty_name"
        ),
    )