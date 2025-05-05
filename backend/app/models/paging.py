from typing import Generic, TypeVar

from pydantic import BaseModel, field_validator
from sqlmodel import Field, SQLModel

from app.core.config import settings

T = TypeVar("T")


class QueryPaging(SQLModel):
    page: int = Field(default=1, ge=1)
    take: int = Field(
        default=20,
    )

    @field_validator("take")
    @classmethod
    def enforce_take_number(cls, value):
        if value not in settings.ALLOWED_TAKE_AMOUNT:
            raise ValueError(
                f"take must be one of {settings.ALLOWED_TAKE_AMOUNT}"
            )
        return value


class PagingResponse(BaseModel, Generic[T]):
    items: list[T]
    current_page: int
    max_page: int
    max_items: int
