from typing import Any, Optional, TypeVar, Generic
from sqlmodel import SQLModel
from pydantic import BaseModel

T = TypeVar("T")


class AppResponse(BaseModel, Generic[T]):
    message: str = ""
    detail: Optional[T] = None
