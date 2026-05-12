from sqlalchemy import (
    Column,
    Integer,
    Time,
    ForeignKey,
    String,
    Boolean
)
from sqlalchemy.orm import relationship
from app.core.base_model import Base


class DoctorScheduleConfig(Base):
    __tablename__ = "doctor_schedule_config"

    id = Column(Integer, primary_key=True)

    doctor_id = Column(
        Integer,
        ForeignKey("doctor.id"),
        nullable=False,
        unique=True
    )

    weekdays = Column(
        String(50),
        nullable=False
    )

    start_time = Column(
        Time,
        nullable=False
    )

    end_time = Column(
        Time,
        nullable=False
    )

    slot_duration = Column(
        Integer,
        nullable=False
    )

    months_ahead = Column(
        Integer,
        nullable=False
    )

    is_active = Column(
        Boolean,
        default=True
    )

    doctor = relationship(
        "Doctor",
        back_populates="schedule_config"
    )