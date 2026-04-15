import os
from datetime import datetime, timedelta, timezone

from dotenv import load_dotenv
from jose import jwt, JWTError

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY não definida nas variáveis de ambiente")


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({
        "iat": now,
        "exp": expire,
    })

    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise ValueError("Token inválido ou expirado")