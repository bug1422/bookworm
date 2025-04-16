from typing import Any,Optional
from pydantic import BaseModel
class AppResponse(BaseModel):
    status_code: int
    message: str = ""
    detail: Optional[Any] = None