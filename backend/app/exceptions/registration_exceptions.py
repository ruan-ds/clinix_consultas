from fastapi import HTTPException


def business_error(field: str, message: str) -> None:
    raise HTTPException(
        status_code=400,
        detail={
            "field": field,
            "message": message
        }
    )

def cpf_already_exists() -> None:
    business_error("cpf", "CPF já cadastrado")


def email_already_exists() -> None:
    business_error("email", "Email já cadastrado")

def invalid_cpf() -> None:
    business_error("cpf", "CPF inválido")