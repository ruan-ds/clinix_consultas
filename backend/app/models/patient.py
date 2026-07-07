from sqlalchemy import Column, Integer, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.core.base_model import Base


class Patient(Base):
    __tablename__ = "patient"

    id = Column(Integer, ForeignKey("person.id"), primary_key=True)
    is_active = Column(Boolean, default=True, nullable=False)

    patient_access = relationship("PatientAccess", back_populates="patient", uselist=False)
    person = relationship("Person", back_populates="patient", uselist=False)
    medical_appointments = relationship("MedicalAppointment", back_populates="patient")
    dependent_links = relationship(
        "Dependent",
        foreign_keys="Dependent.guardian_patient_id",
        back_populates="guardian_patient",
    )
    guardian_links = relationship(
        "Dependent",
        foreign_keys="Dependent.dependent_patient_id",
        back_populates="dependent_patient",
    )
