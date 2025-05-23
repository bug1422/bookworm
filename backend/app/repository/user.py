from sqlmodel import select

from app.models.user import User
from app.repository.base import BaseRepository


class UserRepository(BaseRepository[User]):
    def __init__(self, session):
        super().__init__(User, session)

    def get_by_email(self, email: str) -> User | None:
        return self.session.exec(
            select(User).where(User.email == email)
        ).first()
