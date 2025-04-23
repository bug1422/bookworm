from app.repository.category import CategoryRepository
from app.services.wrapper import async_res_wrapper


class CategoryService:
    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    async def get_list_of_name(self) -> list[str]:
        return await self.repository.get_list_of_name()
