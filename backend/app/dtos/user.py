from pydantic import BaseModel
from app.models import User

class UserLoginDTO(BaseModel):
    email: str
    password: str

class UserDTO(BaseModel):
    email: str | None = None
    full_name: str | None = None
    admin: bool
    
    @classmethod
    def from_sqlmodel(cls, user: User):
        return cls(email=user.email, full_name=f"{user.last_name} {user.first_name}",admin=user.admin)
