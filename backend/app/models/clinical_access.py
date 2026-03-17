from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
)
from app.models.clinic import Clinic


class ClinicalAccess(Clinic):
    __tablename__ = "clinical_access"

    id = Column(Integer, primary_key=True, index=True)
    clinic_id = Column(Integer, ForeignKey("clinic.id"), nullable=False)
    person_id = Column(Integer, ForeignKey("person.id"), nullable=False)
    email = Column(String(300), unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(30), nullable=False)

    person = relationship("Person", back_populates="clinical_access")