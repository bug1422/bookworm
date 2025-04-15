from sqlmodel import SQLModel, Numeric, Relationship, Field
from typing import Optional
from decimal import Decimal

class BookBase(SQLModel):
    book_title: str = Field(nullable=False, max_length=255, index=True)
    book_summary: str = Field()
    book_price: Decimal = Field(default=0,max_digits=5,decimal_places=2)
    book_cover_photo: str = Field(max_length=20)


class Book(BookBase, table=True):
    __tablename__ = "book"
    id: Optional[int] = Field(default=None, primary_key=True)
    author_id: int = Field(nullable=False, foreign_key="author.id")
    author: "Author" = Relationship(back_populates="books")
    category_id: int = Field(nullable=False, foreign_key="category.id")
    category: "Category" = Relationship(back_populates="books")
    discounts: list["Discount"] = Relationship(back_populates="book")    
    reviews: list["Review"] = Relationship(back_populates="book")    
