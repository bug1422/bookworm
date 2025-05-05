from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Relationship, SQLModel

if TYPE_CHECKING:
    from app.models import Book

class AuthorBase(SQLModel):
    author_name: str = Field(nullable=False, max_length=255)
    author_bio: str = Field(nullable=False)


class Author(AuthorBase, table=True):
    __tablename__ = "author"
    id: Optional[int] = Field(default=None, primary_key=True)
    books: list["Book"] = Relationship(back_populates="author")
