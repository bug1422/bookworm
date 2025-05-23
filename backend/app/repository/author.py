from sqlmodel import and_, func, select

from app.models.author import Author
from app.repository.base import BaseRepository


class AuthorRepository(BaseRepository[Author]):
    def __init__(self, session):
        super().__init__(Author, session)

    def get_list_of_name(self) -> list[str]:
        author_names = self.session.exec(
            select(Author.author_name).distinct().order_by(Author.author_name)
        ).all()
        return author_names
