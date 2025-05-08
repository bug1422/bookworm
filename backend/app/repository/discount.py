from sqlmodel import and_, func, select

from app.models.discount import Discount
from app.repository.base import BaseRepository


class DiscountRepository(BaseRepository[Discount]):
    def __init__(self, session):
        super().__init__(Discount, session)
