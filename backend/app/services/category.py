from app.services.base import BaseService
from app.repository.category import CategoryRepository
from app.services.response import async_res_wrapper


class CategoryService(BaseService[CategoryRepository]):
    def __init__(self, category_repo: CategoryRepository):
        super().__init__(category_repo)

    @async_res_wrapper
    async def get_list_of_name(self) -> list[str]:
        return await self.repository.get_list_of_name()