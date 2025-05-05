from app.models.discount import Discount
from app.repository.discount import DiscountRepository
from app.services.wrapper import res_wrapper


class DiscountService:
    def __init__(self, repository: DiscountRepository):
        self.repository = repository

    @res_wrapper
    def get_by_id(self, id: int) -> Discount:
        return self.repository.get_by_id(id)
