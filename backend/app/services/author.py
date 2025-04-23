from app.repository.author import AuthorRepository
from app.services.wrapper import async_res_wrapper


class AuthorService:
    def __init__(self, repository: AuthorRepository):
        self.repository = repository

    async def get_list_of_name(self) -> list[str]:
        return await self.repository.get_list_of_name()
