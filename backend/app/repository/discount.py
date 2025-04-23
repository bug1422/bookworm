from app.repository.base import BaseRepository
from sqlmodel import select, func, and_
from app.models.discount import Discount


class DiscountRepository(BaseRepository[Discount]):
    def __init__(self, session):
        super().__init__(Discount, session)
