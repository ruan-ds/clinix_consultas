import logging
from fastapi import HTTPException
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)


def login_error() -> None:
    logger.warning("Tentativa de login com credenciais inválidas")
    raise HTTPException(
        status_code=401,
        detail={
            "code": "INVALID_CREDENTIALS",
            "message": "Usuário ou senha inválidos"
        },
        headers={"WWW-Authenticate": "Bearer"},
    )