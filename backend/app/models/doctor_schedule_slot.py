from sqlalchemy import (
    Column,
    Integer,
    DateTime,
    ForeignKey,
    String,
    Index
)
from sqlalchemy.orm import relationship
from app.core.base_model import Base


class DoctorScheduleSlot(Base):
    __tablename__ = "doctor_schedule_slot"

    id = Column(Integer, primary_key=True)

    doctor_id = Column(
        Integer,
        ForeignKey("doctor.id"),
        nullable=False,
        index=True
    )

    start_datetime = Column(
        DateTime(timezone=True),
        nullable=False,
        index=True
    )

    end_datetime = Column(
        DateTime(timezone=True),
        nullable=False
    )

    status = Column(
        String(20),
        nullable=False
    )

    doctor = relationship(
        "Doctor",
        back_populates="schedule_slots"
    )

    medical_appointment = relationship(
        "MedicalAppointment",
        back_populates="slot",
        uselist=False
    )

    __table_args__ = (
        Index("ix_doctor_slot_datetime", "doctor_id", "start_datetime"),
    )