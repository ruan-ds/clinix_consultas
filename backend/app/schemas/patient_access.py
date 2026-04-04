from app.schemas.address import CreateAddress
from app.schemas.person import CreatePerson
from app.schemas.phone import CreatePhone

from pydantic import (BaseModel,
                      StringConstraints,
                      ConfigDict
                      )
from typing import Optional, Annotated


class BasePatientAccess(BaseModel):
    person_id: int
    email: Annotated[str, StringConstraints(max_length=300)]


class CreatePatientAccess(BaseModel):
    email: Annotated[str, StringConstraints(max_length=300)]
    password: Annotated[str, StringConstraints(min_length=8)]


class UpdatePatientAccess(BaseModel):
    email: Optional[Annotated[str, StringConstraints(max_length=300)]] = None
    password: Optional[Annotated[str, StringConstraints(min_length=8)]] = None


class OutPatientAccess(BasePatientAccess):
    id: int
    is_active: bool
    model_config = ConfigDict(from_attributes=True)


class FullPatientAccessRegistration(BaseModel):
    person: CreatePerson
    address: CreateAddress
    phone: CreatePhone
    access: CreatePatientAccess


class LoginPatientAccess(BaseModel):
    email: Annotated[str, StringConstraints(max_length=300)]
    password: Annotated[str, StringConstraints(min_length=8)]