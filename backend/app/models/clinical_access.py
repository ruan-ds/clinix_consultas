from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    UniqueConstraint,
)
from app.core.base_model import Base


class ClinicalAccess(Base):
    __tablename__ = "clinical_access"

    id = Column(Integer, primary_key=True)
    clinic_id = Column(Integer, ForeignKey("clinic.id"), nullable=False, index=True)
    person_id = Column(Integer, ForeignKey("person.id"), nullable=False, index=True)
    email = Column(String(300), unique=True, nullable=False)
    password_hash = Column(String(500), nullable=False)
    role = Column(String(30), nullable=False)
    is_active = Column(Boolean, default=True)

    clinic = relationship("Clinic", back_populates="clinical_access")
    person = relationship("Person", back_populates="clinical_access")
    doctor = relationship("Doctor", back_populates="clinical_access", uselist=False)
    medical_appointments = relationship("MedicalAppointment", back_populates="clinical_access")


    __table_args__ = (
        UniqueConstraint("clinic_id", "person_id", name="uq_clinic_id_person_id"),
    )
