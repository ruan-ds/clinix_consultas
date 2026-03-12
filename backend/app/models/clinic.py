from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index, UniqueConstraint
from app.core.database import Base

class Clinic(Entity):
    __tablename__ = "clinic"

    id = Column(Integer, primary_key=True)
    clinic_id = Column(Integer, ForeignKey("entity.id"), nullable=True)
    name = Column(String(50), nullable=False, unique=True, index=True)
    cnpj = Column(String(14), nullable=False, unique=True, index=True)
    address_id = Column(Integer, ForeignKey("address.id"), nullable=True)

    address = relationship("Address", back_populates="clinic")
    entity = relationship("Entity", back_populates="clinic")