from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class Entity(Base):
    __tablename__ = "entity"

    id = Column(Integer, primary_key=True)
    type = Column(String(1), nullable=False)

    phones = relationship("Phone", back_populates="entity")

    __mapper_args__ = {
        "polymorphic_on": type,
        "polymorphic_identity": "E"
    }