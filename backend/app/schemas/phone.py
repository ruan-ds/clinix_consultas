from pydantic import BaseModel, StringConstraints, ConfigDict
from typing import Optional, Annotated

class BasePhone(BaseModel):
    entity_id: int
    phone: Annotated[str, StringConstraints(min_length=11, max_length=11)]
    type: Annotated[str, StringConstraints(max_length=50)]


class CreatePhone(BaseModel):
    phone: Annotated[str, StringConstraints(min_length=11, max_length=11)]
    type: Annotated[str, StringConstraints(max_length=50)]


class UpdatePhone(BaseModel):
    phone: Optional[Annotated[str, StringConstraints(min_length=11, max_length=11)]] = None
    type: Optional[Annotated[str, StringConstraints(max_length=50)]] = None



class OutPhone(BasePhone):
    id: int
    model_config = ConfigDict(from_attributes=True)