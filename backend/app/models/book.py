from sqlmodel import SQLModel, Numeric, Relationship, Field
from pydantic import field_validator
from typing import Optional, Literal
from decimal import Decimal
from enum import Enum


class SortOption(Enum):
    ON_SALE = "on-sale"
    POPULARITY = "popularity"
    PRICE_LOW_TO_HGIH = "price-low"
    PRICE_HIGH_TO_LOW = "price-high"

ALLOWED_TAKE_AMOUNT = [5,15,20,25]

class BookQuery(SQLModel):
    page: int = Field(default=1, ge=1)
    take: int = Field(default=20,)
    sort_option: SortOption
    category_name: str | None = None
    author_name: str | None = None
    rating_star: str | None = None
    @field_validator("take")
    @classmethod
    def enforce_take_number(cls, value):
        if value not in ALLOWED_TAKE_AMOUNT:
            raise ValueError(f"take must be one of {ALLOWED_TAKE_AMOUNT}")
        return value


class BookBase(SQLModel):
    book_title: str = Field(nullable=False, max_length=255, index=True)
    book_summary: str = Field()
    book_price: Decimal = Field(default=0, max_digits=5, decimal_places=2)
    book_cover_photo: str = Field(max_length=20)


class BookPreview(SQLModel):
    book_title: str
    book_price: Decimal
    book_cover_photo: str
    author_name: str
    discount_offset: Optional[Decimal] = Field(default=None)
    max_discount_price: Optional[Decimal] = Field(default=None)
    star_rating: Optional[float] = Field(default=None)
    total_review: Optional[int] = Field(default=0)


class Book(BookBase, table=True):
    __tablename__ = "book"
    id: Optional[int] = Field(default=None, primary_key=True)
    author_id: int = Field(nullable=False, foreign_key="author.id")
    author: "Author" = Relationship(back_populates="books")
    category_id: int = Field(nullable=False, foreign_key="category.id")
    category: "Category" = Relationship(back_populates="books")
    discounts: list["Discount"] = Relationship(back_populates="book")
    reviews: list["Review"] = Relationship(back_populates="book")
