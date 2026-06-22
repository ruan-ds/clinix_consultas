from fastapi import HTTPException


def business_error(
    code: str,
    message: str,
    field: str | None = None,
    status_code: int = 400
) -> None:
    raise HTTPException(
        status_code=status_code,
        detail={
            "code": code,
            "message": message,
            "field": field
        }
    )


def cpf_already_exists() -> None:
    business_error(
        code="CPF_ALREADY_EXISTS",
        field="cpf",
        message="CPF já cadastrado"
    )


def email_already_exists() -> None:
    business_error(
        code="EMAIL_ALREADY_EXISTS",
        field="email",
        message="Email já cadastrado"
    )


def invalid_cpf() -> None:
    business_error(
        code="INVALID_CPF",
        field="cpf",
        message="CPF inválido"
    )


def login_error() -> None:
    business_error(code="INVALID_CREDENTIALS", message="Usuário ou senha inválidos", status_code=401)