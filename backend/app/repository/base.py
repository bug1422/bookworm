from typing import Generic, TypeVar, Type
from sqlmodel import SQLModel, Session, select
T = TypeVar("T", bound=SQLModel)


class BaseRepository(Generic[T]):
    def __init__(self, model: Type[T], session: Session):
        self.model = model
        self.session = session

    async def get_all(self) -> list[T]:
        return self.session.exec(select(self.model)).all()

    async def get_by_id(self, id: int) -> T | None:
        return self.session.exec(select(self.model).where(self.model.id == id)).first()

    async def add(self, entity: T) -> T:
        self.session.add(entity)
        self.session.commit()
        self.session.refresh(entity)

    async def update(self, entity: T) -> T:
        self.session.add(entity)
        self.session.commit()
        self.session.refresh(entity)

    async def delete(self, entity: T) -> None:
        self.session.delete(entity)
        self.session.commit()
