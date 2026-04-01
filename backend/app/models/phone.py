from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base


class Phone(Base):
    __tablename__ = "phone"

    id = Column(Integer, primary_key=True)
    entity_id = Column(Integer, ForeignKey("entity.id"), nullable=False, index=True)
    phone = Column(String(11), nullable=False)
    type = Column(String(50), nullable=False)

    entity = relationship("Entity", back_populates="phones")

    __table_args__ = (
        UniqueConstraint("entity_id", "phone", name="uq_entity_phone"),
    )