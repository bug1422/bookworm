from typing import TYPE_CHECKING, Optional

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models import Order


class UserLogin(SQLModel):
    email: str
    password: str


class UserSignup(UserLogin):
    first_name: str
    last_name: str
    is_admin: bool


class UserInfo(SQLModel):
    id: Optional[int] = Field(default=None)
    email: str | None = Field(default=None)
    first_name: str = Field(max_length=50, nullable=False)
    last_name: str = Field(max_length=50, nullable=True)
    admin: bool


class UserBase(SQLModel):
    first_name: str = Field(max_length=50, nullable=False)
    last_name: str = Field(max_length=50, nullable=True)
    email: EmailStr = Field(
        unique=True, nullable=False, index=True, max_length=70
    )
    password: str = Field(max_length=255)


class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    admin: bool = Field(default=False)
    orders: list["Order"] = Relationship(
        back_populates="user", cascade_delete=True
    )
