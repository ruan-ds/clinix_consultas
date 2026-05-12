from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    String,
)
from app.core.base_model import Base


class MedicalSpecialty(Base):
    __tablename__ = "medical_specialty"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False, unique=True)

    doctors = relationship("Doctor", secondary="doctor_specialty", back_populates="specialties")
