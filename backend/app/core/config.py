import secrets
from pydantic import (
    AnyUrl,
    BeforeValidator,
    PostgresDsn,
    computed_field
)
from pydantic_core import Url
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Any, Literal, Annotated, Tuple
import os

ENVIRONMENT: Literal["local", "staging", "testing"] = os.getenv("ENVIRONMENT")

def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="../.env", env_ignore_empty=True, extra="ignore"
    )
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60  # 1 hour
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 1 day
    FRONTEND_HOST: str = "http://localhost:5173"
    BACKEND_CORS_ORIGINS: Annotated[
        list[AnyUrl] | str, BeforeValidator(parse_cors)
    ] = []
    MAX_REVIEW_RATING: int = 5
    MIN_REVIEW_RATING: int = 1
    ALLOWED_TAKE_AMOUNT: list[int] = []
    MAX_ITEM_QUANTITY: int = 8
    IMAGES_ENDPOINT: str = "/images"
    SUPPORTED_IMAGE_EXTENSIONS: Tuple[str, ...] = ('.png', '.jpg', '.jpeg')
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    IMAGES_DIR: str = os.path.join(BASE_DIR, "images")

    @computed_field
    @property
    def all_cors_origins(self) -> list[str]:
        return [
            str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGINS
        ] + [self.FRONTEND_HOST]

    PROJECT_NAME: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str = ""

    @property
    def POSTGRES_SERVER(self) -> str:
        return ""

    @property
    def POSTGRES_PORT(self) -> int:
        return 0

    @property
    def POSTGRES_DB(self) -> str:
        return ""

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


class StagingSettings(Settings):
    TESTING: bool = False
    POSTGRES_STAGING_SERVER: str
    POSTGRES_STAGING_DB: str
    POSTGRES_STAGING_PORT: int

    @property
    def POSTGRES_SERVER(self) -> str:
        return self.POSTGRES_STAGING_SERVER

    @property
    def POSTGRES_PORT(self) -> int:
        return self.POSTGRES_STAGING_PORT

    @property
    def POSTGRES_DB(self) -> str:
        return self.POSTGRES_STAGING_DB


class DevSettings(Settings):
    TESTING: bool = False
    POSTGRES_DEV_SERVER: str
    POSTGRES_DEV_DB: str
    POSTGRES_DEV_PORT: int

    @property
    def POSTGRES_SERVER(self) -> str:
        return self.POSTGRES_DEV_SERVER

    @property
    def POSTGRES_PORT(self) -> int:
        return self.POSTGRES_DEV_PORT

    @property
    def POSTGRES_DB(self) -> str:
        return self.POSTGRES_DEV_DB


class TestSettings(Settings):
    TESTING: bool = True
    POSTGRES_TEST_SERVER: str
    POSTGRES_TEST_DB: str
    POSTGRES_TEST_PORT: int
    TEST_API_URL: str
    @property
    def POSTGRES_SERVER(self) -> str:
        return self.POSTGRES_TEST_SERVER

    @property
    def POSTGRES_PORT(self) -> int:
        return self.POSTGRES_TEST_PORT

    @property
    def POSTGRES_DB(self) -> str:
        return self.POSTGRES_TEST_DB

if ENVIRONMENT == "staging":
    settings = StagingSettings()
elif ENVIRONMENT == "local":
    settings = DevSettings()
else:
    settings = TestSettings()