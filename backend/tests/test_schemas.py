import pytest
from pydantic import ValidationError
from datetime import date

from app.schemas.person import CreatePerson

def test_person_schema_validation():
    with pytest.raises(ValidationError):

        CreatePerson(name = "A" * 500, 
                     cpf = "12345678900",
                     sex = "M",
                     birthday=date(2000, 9, 6),
                     address_id=1)