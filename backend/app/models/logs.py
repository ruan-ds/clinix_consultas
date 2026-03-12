from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index, UniqueConstraint
from app.core.database import Base

class Logs(Entity):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True)
    entity_type = Column(String(50), nullable=True)
    entity_id = Column(Integer, ForeignKey("entity.id"), nullable=True)
    action = Column(String(1), nullable=True)
    author_id = Column(Integer, ForeignKey("entity.id"), nullable=True)
    author_type = Column(String(2), nullable=True)
    description = Column(String(400), nullable=True)
    ip = Column(String(45), nullable=True)
    created_at = Column(String(50), nullable=True)

    entity = relationship("Entity", back_populates="clinical_access")