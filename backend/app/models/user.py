from sqlmodel import SQLModel, Relationship, Field
from pydantic import EmailStr
from typing import Optional
class UserBase(SQLModel):
    first_name: str = Field(max_length=50,nullable=False)
    last_name: str = Field(max_length=50,nullable=True)
    email: EmailStr = Field(unique=True,nullable=False, index=True, max_length=70)
    password: str = Field(max_length=255)
    
class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    admin: bool = Field(default=False)
    orders: list["Order"] = Relationship(back_populates="user",cascade_delete=True)
    
