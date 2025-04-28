from typing import Any, Optional
from sqlmodel import SQLModel


class AppResponse(SQLModel):
    message: str = ""
    detail: Optional[Any] = None
