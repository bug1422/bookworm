from typing import Any, Generic, Optional, TypeVar

from pydantic import BaseModel
from sqlmodel import SQLModel

T = TypeVar("T")


class AppResponse(BaseModel, Generic[T]):
    message: str = ""
    detail: Optional[T] = None
