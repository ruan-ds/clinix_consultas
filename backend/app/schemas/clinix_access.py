from pydantic import (BaseModel,
                      StringConstraints,
                      ConfigDict,
                      field_validator)
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

    @field_validator("password")
    @classmethod
    def hash_password(cls, v: str) -> str:
        return ph.hash(v)
        

class FullClinixAccess(BaseClinixAccess):
    password_hash: Annotated[str, StringConstraints(max_length=500)]


    @classmethod
    def build_full_clinix_access(cls, data: CreateClinixAccess) -> "FullClinixAccess":
        return cls(
            person_id=data.person_id,
            email=data.email,
            role=data.role,
            password_hash=data.password
            )


class UpdateClinixAccess(BaseModel):
    email: Optional[Annotated[str, StringConstraints(max_length=300)]] = None
    password: Optional[Annotated[str, StringConstraints(min_length=8)]] = None

    @field_validator("password")
    @classmethod
    def hash_password(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        return ph.hash(v)
    

class OutClinixAccess(BaseClinixAccess):
    id: int
    is_active: bool
    model_config = ConfigDict(from_attributes=True)