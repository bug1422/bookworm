from app.repository.user import UserRepository
from app.models.user import User, UserInfo
from app.services.wrapper import async_res_wrapper
from app.core.security import pwd_context 


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.repository = user_repo

    @async_res_wrapper
    async def get_user_info(self, id: int) -> UserInfo:
        user = await self.repository.get_by_id(id)
        if user:
            return UserInfo(**user.model_dump())
        else:
            raise Exception("No user found")

    @async_res_wrapper
    async def get_by_email_and_password(
        self, email: str, password: str
    ) -> User | None:
        user = await self.repository.get_by_email(email)
        if user and self.verify_password(password, user.password):
            return user
        else:
            raise Exception("Incorrect email or password")

    @async_res_wrapper
    async def create_account(
        self, first_name: str, last_name: str, admin: bool, email: str, password: str
    ) -> User:
        user = await self.repository.get_by_email(email)
        if user:
            raise Exception("Email has already been used")
        user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=self.hash_password(password),
            admin=admin
            )
        self.repository.add(user)
        self.repository.commit()
        return user

    def hash_password(self,plain) -> str:
        return pwd_context.hash(plain)

    def verify_password(self, plain, hashed) -> bool:

        return pwd_context.verify(plain, hashed)
