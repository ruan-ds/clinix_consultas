from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    JSON,
)
from app.models.entity import Entity


class Logs(Entity):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True)
    table_name = Column(String(30), nullable=False)
    record_id = Column(Integer, nullable=False)
    action = Column(String(1), nullable=False)
    author_id = Column(Integer, ForeignKey("entity.id"), nullable=False)
    author_type = Column(String(2), nullable=False)
    description = Column(String(400), nullable=False)
    payload = Column(JSON, nullable=True)
    ip = Column(String(45), nullable=False)
    created_at = Column(String(50), nullable=False)
