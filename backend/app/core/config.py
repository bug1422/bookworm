import secrets
from pydantic import (
    AnyUrl,
    BeforeValidator,
    EmailStr,
    HttpUrl,
    PostgresDsn,
    computed_field,
    model_validator
)
from pydantic_core import Url
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Any, Literal, Annotated
def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="../.env",
        env_ignore_empty=True,
        extra="ignore"
    )
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    FRONTEND_HOST: str = "http://localhost:5173"
    ENVIRONMENT: Literal["local","staging","production"] = "local"
    BACKEND_CORS_ORIGINS: Annotated[list[AnyUrl] | str, BeforeValidator(parse_cors)] = []
    MAX_REVIEW_RATING: int = 5
    MIN_REVIEW_RATING: int = 1
    ALLOWED_TAKE_AMOUNT: list[int] = []
    MAX_ITEM_QUANTITY: int = 8
    @computed_field
    @property
    def all_cors_origins(self) -> list[str]:
        return [str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGINS] + [self.FRONTEND_HOST]    

    PROJECT_NAME: str
    POSTGRES_SERVER: str
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = ""
    
    @computed_field
    @property
    def SQLMODEL_DATABASE_URI(self) -> PostgresDsn:
        return Url.build(
            scheme="postgresql+psycopg2",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB
        )

settings = Settings()