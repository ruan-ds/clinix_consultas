from pydantic import (BaseModel,
                      StringConstraints,
                      ConfigDict)
from typing import Optional, Annotated

from argon2 import PasswordHasher

ph = PasswordHasher()


class BaseClinixAccess(BaseModel):
    person_id: int
    email: Annotated[str, StringConstraints(max_length=300)]
    role: Annotated[str, StringConstraints(max_length=30)]


class CreateClinixAccess(BaseClinixAccess):
    # password aqui já vem hasheada pelo validator
    password: Annotated[str, StringConstraints(min_length=8)]


class UpdateClinixAccess(BaseModel):
    email: Optional[Annotated[str, StringConstraints(max_length=300)]] = None
    password: Optional[Annotated[str, StringConstraints(min_length=8)]] = None


class OutClinixAccess(BaseClinixAccess):
    id: int
    is_active: bool
    model_config = ConfigDict(from_attributes=True)