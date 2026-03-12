from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class Address(Base):
    __tablename__ = "address"

    id = Column(Integer, primary_key=True)
    state = Column(String(2), nullable=False)
    city = Column(String(40), nullable=False)
    neighborhood = Column(String(50), nullable=False)
    street = Column(String(50), nullable=False)
    number = Column(String(10), nullable=False)
    complement = Column(String(10))
    cep = Column(String(8), nullable=False, index=True)

    persons = relationship("Person", back_populates="address")