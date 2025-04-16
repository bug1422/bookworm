from typing import Generic, TypeVar
from app.repository.base import BaseRepository,T

R = TypeVar("R", bound=BaseRepository[T])

class BaseService(Generic[R]):
    def __init__(self,repository: R):
        self.repository = repository