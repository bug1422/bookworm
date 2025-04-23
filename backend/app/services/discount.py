from app.services.wrapper import async_res_wrapper
from app.repository.discount import DiscountRepository
from app.models.discount import Discount


class DiscountService:
    def __init__(self, repository: DiscountRepository):
        self.repository = repository

    async def get_by_id(self, id: int) -> Discount:
        return await self.repository.get_by_id(id)
