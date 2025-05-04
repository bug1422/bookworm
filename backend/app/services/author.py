from app.repository.author import AuthorRepository


class AuthorService:
    def __init__(self, repository: AuthorRepository):
        self.repository = repository

    def get_list_of_name(self) -> list[str]:
        return self.repository.get_list_of_name()
