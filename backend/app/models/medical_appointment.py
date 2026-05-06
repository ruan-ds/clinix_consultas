from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    Boolean,
    ForeignKey,
    func,
    DateTime,
    UniqueConstraint
)
from app.core.base_model import Base


class MedicalAppointment(Base):
    __tablename__ = "medical_appointment"

    id = Column(Integer, primary_key=True)
    clinic_id = Column(Integer, ForeignKey("clinic.id"), nullable=False, index=True)
    doctor_id = Column(Integer, ForeignKey("clinical_access.id"), nullable=False, index=True)
    patient_id = Column(Integer, ForeignKey("patient_access.id"), nullable=False, index=True)
    service_id = Column(Integer, ForeignKey("service.id"), nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    is_active = Column(Boolean, default=True)

    clinic = relationship("Clinic", back_populates="medical_appointment")
    clinical_access = relationship("ClinicalAccess", back_populates="medical_appointment")
    patient_access = relationship("PatientAccess", back_populates="medical_appointment")
    service = relationship("Service", back_populates="medical_appointment")


    __table_args__ = (
        UniqueConstraint("clinic_id", "doctor_id", "patient_id", name="uq_clinic_id_doctor_id_patient_id"),
    )