from pydantic import (BaseModel,
                      StringConstraints,
                      ConfigDict,
                      field_validator)
from typing import Optional, Annotated

from argon2 import PasswordHasher

ph = PasswordHasher()


class BaseClinicalAccess(BaseModel):
    clinic_id: int
    person_id: int
    email: Annotated[str, StringConstraints(max_length=300)]
    role: Annotated[str, StringConstraints(max_length=30)]


class CreateClinicalAccess(BaseClinicalAccess):
    # password aqui já vem hasheada pelo validator
    password: Annotated[str, StringConstraints(min_length=8)]


class UpdateClinicalAccess(BaseModel):
    email: Optional[Annotated[str, StringConstraints(max_length=300)]] = None
    password: Optional[Annotated[str, StringConstraints(min_length=8)]] = None


class OutClinicalAccess(BaseClinicalAccess):
    id: int
    is_active: bool
    model_config = ConfigDict(from_attributes=True)