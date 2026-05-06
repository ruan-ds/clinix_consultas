from sqlalchemy import Column, Integer, String, Date, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.models.entity import Entity


class Person(Entity):
    __tablename__ = "person"

    id = Column(Integer, ForeignKey("entity.id"), primary_key=True)
    name = Column(String(50), nullable=False, index=True)
    cpf = Column(String(11), nullable=False, unique=True)
    sex = Column(String(1), nullable=False)
    birthday = Column(Date, nullable=False)
    address_id = Column(Integer, ForeignKey("address.id"), nullable=False, index=True)

    address = relationship("Address", back_populates="persons")
    patient_access = relationship("PatientAccess", back_populates="person", uselist=False)
    clinical_access = relationship("ClinicalAccess", back_populates="person")
    clinix_access = relationship("ClinixAccess", back_populates="person")
    dependents_of = relationship("Dependent", foreign_keys="Dependent.person_id", back_populates="dependent_person")
    guardians_of = relationship("Dependent", foreign_keys="Dependent.guardian_id", back_populates="guardian_person")

    __mapper_args__ = {"polymorphic_identity": "P"}

    __table_args__ = (
        UniqueConstraint("cpf", name="uq_person_cpf"),
    )