from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    Integer,
    Text,
    Boolean,
    ForeignKey,
    func,
    DateTime,
)
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship
from app.core.base_model import Base


class PatientPrescription(Base):
    __tablename__ = "patient_prescription"

    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey("patient.id"), nullable=False, index=True)
    clinic_id = Column(Integer, ForeignKey("clinic.id"), nullable=False, index=True)
    doctor_id = Column(Integer, ForeignKey("doctor.id"), nullable=False, index=True)
    prescription = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    date_valid = Column(DateTime(timezone=True), nullable=False)

    patient = relationship("Patient", back_populates="prescriptions")
    clinic = relationship("Clinic", back_populates="prescriptions")
    doctor = relationship("Doctor", back_populates="prescriptions")

    @hybrid_property
    def is_valid(self) -> bool:
        return datetime.now(timezone.utc) <= self.date_valid