from pydantic import BaseModel, StringConstraints, ConfigDict
from typing import Optional, Literal, Annotated

class BaseAddress(BaseModel):
    state: Literal["AC", "AL", "AP", "AM", "BA",
                    "CE", "DF", "ES", "GO", "MA",
                    "MT", "MS", "MG", "PA", "PB",
                    "PR", "PE", "PI", "RJ", "RN",
                    "RS", "RO", "RR", "SC", "SP",
                    "SE", "TO"]
    city: Annotated[str, StringConstraints(max_length=40)]
    neighborhood: Annotated[str, StringConstraints(max_length=50)]
    street: Annotated[str, StringConstraints(max_length=50)]
    number: Annotated[str, StringConstraints(max_length=10)]
    complement: Optional[Annotated[str, StringConstraints(max_length=10)]] = None
    cep: Annotated[str, StringConstraints(min_length=8, max_length=8)]

class CreateAddress(BaseAddress):
    pass

class UpdateAddress(BaseModel):
    state: Optional[Literal["AC", "AL", "AP", "AM", "BA",
                    "CE", "DF", "ES", "GO", "MA",
                    "MT", "MS", "MG", "PA", "PB",
                    "PR", "PE", "PI", "RJ", "RN",
                    "RS", "RO", "RR", "SC", "SP",
                    "SE", "TO"]] = None
    city: Optional[Annotated[str, StringConstraints(max_length=40)]] = None
    neighborhood: Optional[Annotated[str, StringConstraints(max_length=50)]] = None
    street: Optional[Annotated[str, StringConstraints(max_length=50)]] = None
    number: Optional[Annotated[str, StringConstraints(max_length=10)]] = None
    complement: Optional[Annotated[str, StringConstraints(max_length=10)]] = None
    cep: Optional[Annotated[str, StringConstraints(min_length=8, max_length=8)]] = None

class OutAddress(BaseAddress):
    id: int
    model_config = ConfigDict(from_attributes=True)
