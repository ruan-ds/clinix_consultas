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
    dependent_patient_id = Column(Integer, ForeignKey("patient.id"), nullable=False, index=True)
    guardian_patient_id = Column(Integer, ForeignKey("patient.id"), nullable=False, index=True)
    is_active = Column(Boolean, default=True)

    dependent_patient = relationship("Patient", foreign_keys=[dependent_patient_id], back_populates="guardian_links")
    guardian_patient = relationship("Patient", foreign_keys=[guardian_patient_id], back_populates="dependent_links")

    __table_args__ = (
        UniqueConstraint("guardian_patient_id", "dependent_patient_id", name="uq_guardian_dependent"),
    )
