from sqlalchemy import (
    Column,
    Integer,
    ForeignKey,
    UniqueConstraint
)
from app.core.base_model import Base


class DoctorSpecialty(Base):
    __tablename__ = "doctor_specialty"

    id = Column(Integer, primary_key=True)

    doctor_id = Column(
        Integer,
        ForeignKey("doctor.id"),
        nullable=False,
        index=True
    )

    specialty_id = Column(
        Integer,
        ForeignKey("medical_specialty.id"),
        nullable=False,
        index=True
    )

    __table_args__ = (
        UniqueConstraint(
            "doctor_id",
            "specialty_id",
            name="uq_doctor_specialty"
        ),
    )