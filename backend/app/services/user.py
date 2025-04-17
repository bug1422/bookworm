from app.services.base import BaseService
from app.repository.user import UserRepository
from app.models.user import User, UserInfo
from sqlmodel import Session
from app.services.response import async_res_wrapper


class UserService(BaseService[UserRepository]):
    def __init__(self, user_repo: UserRepository):
        super().__init__(UserRepository(user_repo))

    @async_res_wrapper
    async def get_user_info(self, id: int) -> UserInfo:
        user = await self.repository.get_by_id(id)
        if user:
            return UserInfo(**user.model_dump())
        else:
            raise Exception("No user found")


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
