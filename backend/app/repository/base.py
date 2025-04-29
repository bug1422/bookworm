from typing import Generic, TypeVar, Type
from sqlmodel import SQLModel, Session, select
from typing import Any

T = TypeVar("T", bound=SQLModel)


class BaseRepository(Generic[T]):
    def __init__(self, model: Type[T], session: Session):
        self.model = model
        self.session = session

    async def get_by_id(self, id: int) -> T | None:
        return self.session.exec(
            select(self.model).where(self.model.id == id)
        ).first()

    def add(self, entity: T) -> T:
        self.session.add(entity)

    def add_range(self, items: list[T]):
        self.session.add_all(items)

    def update(self, entity: T) -> T:
        self.session.add(entity)

    def delete(self, entity: T) -> None:
        self.session.delete(entity)

    def rollback(self):
        self.session.rollback()

    def commit(self) -> None:
        self.session.commit()

    def refresh(self, entity: T) -> None:
        self.session.refresh(entity)
