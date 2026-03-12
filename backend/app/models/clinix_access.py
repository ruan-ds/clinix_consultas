from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index, UniqueConstraint
from app.core.database import Base

class ClinixAccess(Entity):
    __tablename__ = "clinix_access"

    id = Column(Integer, primary_key=True)
    person_id = Column(Integer, ForeignKey("entity.id"), nullable=True)
    email = Column(String(300), unique=True, index=True)
    password_hash = Column(String(255), nullable=True)
    role = Column(String(30), nullable=True)

    entity = relationship("Entity", back_populates="clinical_access")