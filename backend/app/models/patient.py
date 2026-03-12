from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Patient(Base):
    __tablename__ = "patient"

    id = Column(Integer, primary_key=True)
    person_id = Column(Integer, ForeignKey("person.id"), nullable=False, unique=True)
    email = Column(String(300), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)

    person = relationship("Person", back_populates="patient")