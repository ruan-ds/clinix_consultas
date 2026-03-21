from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
)
from app.models.entity import Entity


class Clinic(Entity):
    __tablename__ = "clinic"

    id = Column(Integer, ForeignKey("entity.id"), primary_key=True)
    name = Column(String(50), nullable=False, unique=True)
    cnpj = Column(String(14), nullable=False, unique=True)
    address_id = Column(Integer, ForeignKey("address.id"), nullable=False)
    is_active = Column(Boolean, default=True)


    address = relationship("Address", back_populates="clinic")
    clinical_access = relationship("ClinicalAccess", back_populates="clinic")

    __mapper_args__ = {"polymorphic_identity": "C"}