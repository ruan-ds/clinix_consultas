from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
)
from app.core.database import Base


class ClinixAccess(Base):
    __tablename__ = "clinix_access"

    id = Column(Integer, primary_key=True)
    person_id = Column(Integer, ForeignKey("person.id"), nullable=False, unique=True)
    email = Column(String(300), unique=True, nullable=False)
    password_hash = Column(String(500), nullable=False)
    role = Column(String(30), nullable=False)
    is_active = Column(Boolean, default=True)

    person = relationship("Person", back_populates="clinix_access")