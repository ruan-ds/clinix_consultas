from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.base_model import Base


class PatientAccess(Base):
    __tablename__ = "patient_access"

    id = Column(Integer, primary_key=True)
    patient_id = Column(Integer, ForeignKey("patient.id"), nullable=False, unique=True)
    email = Column(String(300), nullable=False, unique=True)
    password_hash = Column(String(500), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    patient = relationship("Patient", back_populates="patient_access")