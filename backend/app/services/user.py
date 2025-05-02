from app.repository.user import UserRepository
from app.models.user import User, UserInfo
from app.models.exception import NotFoundException
from app.services.wrapper import res_wrapper
from app.core.security import pwd_context


class UserService:
    def __init__(self, user_repo: UserRepository):
        self.repository = user_repo

    @res_wrapper
    def get_user_info(self, id: int) -> UserInfo:
        user = self.repository.get_by_id(id)
        if user:
            return UserInfo(**user.model_dump())
        else:
            raise NotFoundException("User info")

    @res_wrapper
    def get_by_email_and_password(
        self, email: str, password: str
    ) -> User | None:
        user = self.repository.get_by_email(email)
        if user and pwd_context.verify(password, user.password):
            return user
        else:
            raise Exception("Incorrect email or password")

    @res_wrapper
    def create_account(
        self, first_name: str, last_name: str, admin: bool, email: str, password: str
    ) -> User:
        user = self.repository.get_by_email(email)
        if user:
            raise Exception("Email has already been used")
        user = User(
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=pwd_context.hash(password),
            admin=admin
        )
        self.repository.add(user)
        self.repository.commit()
        self.repository.refresh(user)
        return user