from app.repository.base import BaseRepository
from sqlmodel import select, func, and_
from app.models.review import Review


class ReviewRepository(BaseRepository[Review]):
    def __init__(self, session):
        super().__init__(Review, session)
