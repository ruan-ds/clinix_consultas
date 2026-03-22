from pydantic import BaseModel, StringConstraints, ConfigDict
from typing import Optional, Annotated


class BaseClinic(BaseModel):
    trade_name: Annotated[str, StringConstraints(max_length=60)]
    legal_name: Annotated[str, StringConstraints(max_length=90)]
    cnpj: Annotated[str, StringConstraints(min_length=14, max_length=14)]
    address_id: int


class CreateClinic(BaseClinic):
    pass


class UpdateClinic(BaseModel):
    trade_name: Optional[Annotated[str, StringConstraints(max_length=60)]] = None
    legal_name: Optional[Annotated[str, StringConstraints(max_length=90)]] = None
    address_id: Optional[int] = None
    is_active: Optional[bool] = None


class OutClinic(BaseClinic):
    id: int
    model_config = ConfigDict(from_attributes=True)