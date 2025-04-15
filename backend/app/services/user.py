from app.services.base import BaseService
from app.repository.user import UserRepository, User
from sqlmodel import Session


class UserService(BaseService[UserRepository]):
    def __init__(self, session: Session):
        super().__init__(UserRepository(session))

    async def get_by_id(self, id: int) -> User:
        return await self.repository.get_by_id(id)

    async def get_by_email_and_password(self, email: str, password: str):
        user = await self.repository.get_by_email(email)
        if user and self.verify_password(password, user.password):
            return user
        else:
            return None

    def verify_password(self, plain, hashed) -> bool:
        from app.core.security import pwd_context
        return pwd_context.verify(plain, hashed)