from fastapi import HTTPException


def user_not_found() -> None:
    raise HTTPException(
        status_code=404,
        detail={
                "message": "Usuário não encontrado"
        }
    )


def user_inactive(detail: str) -> None:
    raise HTTPException(
        status_code=403,
        detail={
                "message": "Usuário inativo"
        }
    )
