from fastapi import HTTPException


def cpf_already_exists() -> None:
    raise HTTPException(
        status_code=400,
        detail={
                "field": "cpf",
                "message": "CPF já cadastrado"
        }
    )


def email_already_exists() -> None:
    raise HTTPException(
        status_code=400,
        detail={
                "field": "email",
                "message": "Email já cadastrado"
        }
    )