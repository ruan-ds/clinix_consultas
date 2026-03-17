from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
)
from app.models.entity import Entity


class Clinic(Entity):
    __tablename__ = "clinic"

    id = Column(Integer, primary_key=True)
    clinic_id = Column(Integer, ForeignKey("entity.id"), nullable=False)
    name = Column(String(50), nullable=False, unique=True, index=True)
    cnpj = Column(String(14), nullable=False, unique=True, index=True)
    address_id = Column(Integer, ForeignKey("address.id"), nullable=False)

    address = relationship("Address", back_populates="clinic")
    clinical_access = relationship("ClinicalAccess", back_populates="clinic")