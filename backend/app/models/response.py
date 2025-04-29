from typing import Any, Optional, TypeVar, Generic
from sqlmodel import SQLModel
from pydantic.generics import GenericModel

T = TypeVar("T")


class AppResponse(GenericModel, Generic[T]):
    message: str = ""
    detail: Optional[T] = None
