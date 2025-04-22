from app.models.order_item import OrderItem
from app.repository.base import BaseRepository


class OrderItemRepository(BaseRepository[OrderItem]):
    def __init__(self, session):
        super().__init__(OrderItem, session)
