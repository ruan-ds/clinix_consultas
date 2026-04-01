from sqlalchemy import (
    Column,
    Integer,
    String,
    DateTime,
    JSON,
    Index,
    func,
)
from app.core.database import Base


class Logs(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True)
    table_name = Column(String(30), nullable=False)
    record_id = Column(Integer, nullable=False, index=True)
    action = Column(String(1), nullable=False)
    author = Column(String(30), nullable=False)
    description = Column(String(400), nullable=False)
    payload = Column(JSON, nullable=True)
    ip = Column(String(45), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        Index("ix_logs_table_record", "table_name", "record_id"),
    )