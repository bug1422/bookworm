from typing import Generic, TypeVar, Type
from sqlmodel import SQLModel, Session, select
from typing import Any

T = TypeVar("T", bound=SQLModel)


class BaseRepository(Generic[T]):
    def __init__(self, model: Type[T], session: Session):
        self.model = model
        self.session = session

    def get_by_id(self, id: int) -> T | None:
        return self.session.exec(
            select(self.model).where(self.model.id == id)
        ).first()

    def add(self, entity: T):
        self.session.add(entity)

    def add_range(self, items: list[T]):
        self.session.add_all(items)

    def update(self, entity: T):
        self.session.add(entity)

    def delete(self, entity: T):
        self.session.delete(entity)

    def rollback(self):
        self.session.rollback()

    def commit(self):
        self.session.commit()

    def flush(self):
        self.session.flush()
        
    def refresh(self, entity: T):
        self.session.refresh(entity)
