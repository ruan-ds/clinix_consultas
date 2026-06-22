from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey
)
from sqlalchemy.orm import relationship
from app.core.base_model import Base


class Doctor(Base):
    __tablename__ = "doctor"

    id = Column(Integer, primary_key=True)

    clinical_access_id = Column(
        Integer,
        ForeignKey("clinical_access.id"),
        nullable=False,
        unique=True
    )

    crm = Column(
        String(20),
        nullable=False,
        unique=True
    )

    is_active = Column(
        Boolean,
        default=True
    )

    clinical_access = relationship(
        "ClinicalAccess",
        back_populates="doctor",
        uselist=False
    )

    specialties = relationship(
        "MedicalSpecialty",
        secondary="doctor_specialty",
        back_populates="doctors"
    )

    medical_appointments = relationship(
        "MedicalAppointment",
        back_populates="doctor"
    )

    schedule_config = relationship(
        "DoctorScheduleConfig",
        back_populates="doctor",
        uselist=False
    )

    schedule_slots = relationship(
        "DoctorScheduleSlot",
        back_populates="doctor"
    )

    doctor_services = relationship(
        "DoctorService",
        back_populates="doctor"
    )

    prescriptions = relationship(
        "PatientPrescription",
        back_populates="doctor"
    )