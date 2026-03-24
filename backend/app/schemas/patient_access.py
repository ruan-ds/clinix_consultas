from pydantic import (BaseModel,
                      StringConstraints,
                      ConfigDict,
                      field_validator)
from typing import Optional, Annotated

from argon2 import PasswordHasher

ph = PasswordHasher()


class BasePatientAccess(BaseModel):
    person_id: int
    email: Annotated[str, StringConstraints(max_length=300)]


class CreatePatientAccess(BasePatientAccess):
    # password aqui já vem hasheada pelo validator
    password: Annotated[str, StringConstraints(min_length=8)]

    @field_validator("password")
    @classmethod
    def hash_password(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Senha muito curta.")

        return ph.hash(v)
        

class FullPatientAccess(BasePatientAccess):
    password_hash: Annotated[str, StringConstraints(max_length=500)]


    @classmethod
    def build_full_patient_access(cls, data: CreatePatientAccess) -> "FullPatientAccess":
        return cls(
            person_id=data.person_id,
            email=data.email,
            password_hash=data.password
            )


class UpdatePatientAccess(BaseModel):
    email: Optional[Annotated[str, StringConstraints(max_length=300)]] = None
    password: Optional[Annotated[str, StringConstraints(min_length=8)]] = None

    @field_validator("password")
    @classmethod
    def hash_password(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        if len(v)< 8:
            raise ValueError("Senha muito curta.")

        return ph.hash(v)
    

class OutPatientAccess(BasePatientAccess):
    id: int
    is_active: bool
    model_config = ConfigDict(from_attributes=True)