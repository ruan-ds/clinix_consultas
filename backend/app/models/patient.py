from sqlalchemy import Column, Integer, Date, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from app.models.entity import Entity


class Patient(Entity):
    __tablename__ = "patient"

    id = Column(Integer, ForeignKey("entity.id"), primary_key=True)
    person_id = Column(Integer, ForeignKey("person.id", ondelete="RESTRICT"), nullable=False, index=True, unique=True)
    is_active = Column(Boolean, default=True, nullable=False)

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

    __mapper_args__ = {"polymorphic_identity": "T"}
