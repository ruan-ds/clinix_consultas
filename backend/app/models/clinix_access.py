from sqlalchemy.orm import relationship
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    ForeignKey,
    UniqueConstraint,
)
from app.core.database import Base


class ClinixAccess(Base):
    __tablename__ = "clinix_access"

    id = Column(Integer, primary_key=True)
    person_id = Column(Integer, ForeignKey("person.id"), nullable=False, index=True)
    email = Column(String(300), unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(30), nullable=False)
    is_active = Column(Boolean, default=True)

    person = relationship("Person", back_populates="clinix_access")

    __table_args__ = (
        UniqueConstraint("person_id"),
    )