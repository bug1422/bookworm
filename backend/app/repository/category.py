from sqlmodel import and_, func, select

from app.models.category import Category
from app.repository.base import BaseRepository


class CategoryRepository(BaseRepository[Category]):
    def __init__(self, session):
        super().__init__(Category, session)

    def get_list_of_name(self) -> list[str]:
        categories_name = self.session.exec(
            select(Category.category_name).distinct().order_by(Category.category_name)
        ).all()
        return categories_name
