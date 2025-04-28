from datetime import datetime, timedelta, timezone
from typing import Any
import jwt
from jwt.exceptions import InvalidTokenError
from passlib.context import CryptContext
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


ALGORITHM = "HS256"


def create_token(
    subject: str | Any, data: dict = {}, expires_delta: timedelta = timedelta()
) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + expires_delta
    to_encode.update({"exp": expire, "sub": str(subject)})
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=ALGORITHM
    )
    return encoded_jwt


def decode_token(token: str):
    return jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
