from typing import Generic,TypeVar,Optional
from pydantic import BaseModel
T = TypeVar("T", default= None)
class AppResponse(BaseModel,Generic[T]):
    status_code: int
    message: str
    detail: Optional[T] = None