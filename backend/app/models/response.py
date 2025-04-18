from typing import Any,Optional
from sqlmodel import SQLModel
class AppResponse(SQLModel):
    status_code: int
    message: str = ""
    detail: Optional[Any] = None
    
    