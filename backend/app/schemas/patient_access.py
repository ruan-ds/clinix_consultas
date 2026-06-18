from app.schemas.address import CreateAddress, OutAddress
from app.schemas.person import CreatePerson, OutPerson
from app.schemas.phone import CreatePhone, OutPhone

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


class OutLoginPatientAccess(BaseModel):
    access_token: str
    token_type: str


class OutFullPatientAccess(BaseModel):  
    person: OutPerson  
    address: OutAddress  
    phone: OutPhone  
    access: OutPatientAccess  
    model_config = ConfigDict(from_attributes=True)


class FullPatientAccessRegistration(BaseModel):  
    person: CreatePerson  
    address: CreateAddress  
    phone: CreatePhone  
    access: CreatePatientAccess


class LoginPatientAccess(BaseModel):
    email: str
    password: str