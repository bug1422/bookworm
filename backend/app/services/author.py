from app.services.base import BaseService
from app.repository.author import AuthorRepository
from app.services.response import async_res_wrapper


class AuthorService(BaseService[AuthorRepository]):
    def __init__(self, user_repo: AuthorRepository):
        super().__init__(user_repo)

    @async_res_wrapper
    async def get_list_of_name(self) -> list[str]:
        return await self.repository.get_list_of_name()