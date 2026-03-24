from pydantic import (BaseModel,
                      StringConstraints,
                      ConfigDict,
                      field_validator)
from typing import Optional, Annotated, Literal, Any

from argon2 import PasswordHasher

from enum import Enum

from datetime import datetime

ph = PasswordHasher()


class LogAction(str, Enum):
    CREATE = "C"
    READ = "R"
    UPDATE = "U"
    DELETE = "D"
    LOGIN = "L"
    LOGOUT = "O"


class BaseLogs(BaseModel):
    table_name: Annotated[str, StringConstraints(max_length=30)]
    record_id: int
    action: LogAction
    author: Annotated[str, StringConstraints(max_length=30)]
    description: Annotated[str, StringConstraints(max_length=400)]
    payload: dict[str, Any]
    ip: Annotated[str, StringConstraints(max_length=45)]


class CreateLogs(BaseLogs):
    pass
    

class OutLogs(BaseLogs):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)