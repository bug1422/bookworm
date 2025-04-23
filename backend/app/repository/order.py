from app.models.order import Order
from app.repository.base import BaseRepository


class OrderRepository(BaseRepository[Order]):
    def __init__(self, session):
        super().__init__(Order, session)
