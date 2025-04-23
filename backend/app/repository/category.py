from app.repository.base import BaseRepository
from sqlmodel import select, func, and_
from app.models.category import Category


class CategoryRepository(BaseRepository[Category]):
    def __init__(self, session):
        super().__init__(Category, session)

    async def get_list_of_name(self) -> list[str]:
        categories_name = self.session.exec(
            select(Category.category_name).distinct()
        ).all()
        return categories_name
