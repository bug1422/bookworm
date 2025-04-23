from sqlmodel import SQLModel, Relationship, Field
from typing import Optional


class CategoryBase(SQLModel):
    category_name: str = Field(nullable=False, max_length=120, index=True)
    category_desc: str = Field(max_length=255)


class Category(CategoryBase, table=True):
    __tablename__ = "category"
    id: Optional[int] = Field(default=None, primary_key=True)
    books: list["Book"] = Relationship(back_populates="category")
