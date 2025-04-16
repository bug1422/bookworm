from app.services.base import BaseService
from app.repository.user import UserRepository, User
from sqlmodel import Session
from app.services.response import async_res_wrapper


class UserService(BaseService[UserRepository]):
    def __init__(self, session: Session):
        super().__init__(UserRepository(session))

    @async_res_wrapper
    async def get_by_id(self, id: int) -> User:
        return await self.repository.get_by_id(id)


    @async_res_wrapper
    async def get_by_email_and_password(self, email: str, password: str) -> User | None:
        user = await self.repository.get_by_email(email)
        if user and self.verify_password(password, user.password):
            return user
        else:
            raise Exception("Incorrect email or password")

    def verify_password(self, plain, hashed) -> bool:
        from app.core.security import pwd_context
        return pwd_context.verify(plain, hashed)
