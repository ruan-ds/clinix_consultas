from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.base_model import Base


class PatientAccess(Base):
    __tablename__ = "patient_access"

    id = Column(Integer, primary_key=True)
    person_id = Column(Integer, ForeignKey("person.id"), nullable=False, unique=True)
    email = Column(String(300), unique=True)
    password_hash = Column(String(500), nullable=False)
    is_active = Column(Boolean, default=True)

    person = relationship("Person", back_populates="patient_access")
    medical_appointments = relationship("MedicalAppointment", back_populates="patient_access")
