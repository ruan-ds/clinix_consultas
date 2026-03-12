from sqlalchemy import Column, Integer, String, Date, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base
from backend.app.models.entity import Entity

class Person(Entity):
    __tablename__ = "person"

    id = Column(Integer, ForeignKey("entity.id"), primary_key=True)
    name = Column(String(50), nullable=False, index=True)
    cpf = Column(String(11), nullable=False, unique=True)
    sex = Column(String(1), nullable=False)
    birthday = Column(Date, nullable=False)
    address_id = Column(Integer, ForeignKey("address.id"), nullable=False)

    address = relationship("Address", back_populates="persons")
    patient = relationship("Patient", back_populates="person", uselist=False)

    __mapper_args__ = {  
        "polymorphic_identity": "P",  
    }