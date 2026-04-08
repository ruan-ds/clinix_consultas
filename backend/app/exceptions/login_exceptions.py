from fastapi import HTTPException


def login_error() -> None:
    raise HTTPException(
        status_code=401,
        detail={
                "message": "Usuário ou senha inválidos"
        }
    )