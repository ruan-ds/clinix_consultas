from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    ForeignKey,
    func,
    DateTime,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from app.core.base_model import Base


class PatientMedicalRecord(Base):
    __tablename__ = "patient_medical_record"

    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey("patient.id"), nullable=False, index=True)
    clinic_id = Column(Integer, ForeignKey("clinic.id"), nullable=False, index=True)
    observations = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    is_active = Column(Boolean, default=True)

    patient = relationship("Patient", back_populates="medical_record")
    clinic = relationship("Clinic", back_populates="medical_records")

    __table_args__ = (
        UniqueConstraint("patient_id", "clinic_id", name="uq_patient_clinic_record"),
    )