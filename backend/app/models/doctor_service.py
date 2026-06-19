from sqlalchemy.orm import relationship
from sqlalchemy import Integer, ForeignKey, Column
from app.core.base_model import Base


class DoctorService(Base):
    __tablename__ = "doctor_service"

    doctor_id = Column(Integer, ForeignKey("doctor.id"), primary_key=True)
    service_id = Column(Integer, ForeignKey("service.id"), primary_key=True)

    doctor = relationship("Doctor", back_populates="doctor_services")
    service = relationship("Service", back_populates="doctor_services")