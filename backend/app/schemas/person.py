from pydantic import BaseModel, StringConstraints, ConfigDict
from typing import Optional, Literal, Annotated
from datetime import date


class BasePerson(BaseModel):
    name: Annotated[str, StringConstraints(max_length=50)]
    cpf: Annotated[str, StringConstraints(min_length=11, max_length=11)]
    sex: Literal["M", "F", "L"]
    birthday: date
    address_id: int


class CreatePerson(BasePerson):
    pass


class UpdatePerson(BaseModel):
    name: Optional[Annotated[str, StringConstraints(max_length=50)]] = None
    sex: Optional[Literal["M", "F", "L"]] = None
    address_id: Optional[int] = None


class OutPerson(BasePerson):
    id: int
    model_config = ConfigDict(from_attributes=True)