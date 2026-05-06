from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    Boolean,
    ForeignKey,
    UniqueConstraint,
)
from app.core.base_model import Base


class Dependent(Base):
    __tablename__ = "dependent"

    id = Column(Integer, primary_key=True)
    person_id = Column(Integer, ForeignKey("person.id"), nullable=False, index=True)
    guardian_id = Column(Integer, ForeignKey("person.id"), nullable=False, index=True)
    is_active = Column(Boolean, default=True)

    dependent_person = relationship("Person", foreign_keys=[person_id], back_populates="dependent_of", overlaps="person")
    guardian_person = relationship("Person", foreign_keys=[guardian_id], back_populates="guardian_of",overlaps="person")

    __table_args__ = (
        UniqueConstraint("guardian_id", "person_id", name="uq_guardian_id_person_id"),
    )