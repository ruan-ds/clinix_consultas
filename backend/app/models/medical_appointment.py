from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    func,
    DateTime,
    UniqueConstraint,
    Index
)
from app.core.base_model import Base


class MedicalAppointment(Base):
    __tablename__ = "medical_appointment"

    id = Column(Integer, primary_key=True)
    clinic_id = Column(Integer, ForeignKey("clinic.id"), nullable=False, index=True)
    doctor_id = Column(Integer, ForeignKey("doctor.id"), nullable=False, index=True)
    patient_id = Column(Integer, ForeignKey("patient_access.id"), nullable=False, index=True)
    clinical_access_id = Column(Integer, ForeignKey("clinical_access.id"), nullable=False, index=True)
    service_id = Column(Integer, ForeignKey("service.id"), nullable=False, index=True)
    slot_id = Column(Integer, ForeignKey("doctor_schedule_slot.id"), nullable=False, unique=True, index=True)
    status = Column(String(20), nullable=False)
    notes = Column(String(200), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    is_active = Column(Boolean, default=True)

    clinic = relationship("Clinic", back_populates="medical_appointments")
    doctor = relationship("Doctor", back_populates="medical_appointments")
    patient_access = relationship("PatientAccess", back_populates="medical_appointments")
    clinical_access = relationship("ClinicalAccess", back_populates="medical_appointments")
    service = relationship("Service", back_populates="medical_appointments")
    slot = relationship("DoctorScheduleSlot", back_populates="medical_appointment")
