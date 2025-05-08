from app.repository.category import CategoryRepository
from app.services.wrapper import res_wrapper


class CategoryService:
    def __init__(self, repository: CategoryRepository):
        self.repository = repository

    def get_list_of_name(self) -> list[str]:
        return self.repository.get_list_of_name()
