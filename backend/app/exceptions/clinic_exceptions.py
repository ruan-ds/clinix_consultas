from fastapi import HTTPException
from app.exceptions.patient_exceptions import business_error 


def cnpj_already_exists() -> None: 
    business_error(
        code="CNPJ_ALREADY_EXISTS",
        field="cnpj",
        message="CNPJ já cadastrado"
    )


def invalid_cnpj() -> None:
    business_error(
        code="INVALID_CNPJ",
        field="cnpj",
        message="CNPJ inválido"
    )


def legal_name_already_exists() -> None:
    business_error(
        code="LEGAL_NAME_ALREADY_EXISTS",
        field="legal_name",
        message="Razão social já cadastrada"
    )