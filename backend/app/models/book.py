from decimal import Decimal
from enum import Enum
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Numeric, Relationship, SQLModel

from app.models.money import get_currency
from app.models.paging import QueryPaging

if TYPE_CHECKING:
    from app.models import Author, Category, Discount, Review


class BookSortOption(Enum):
    ON_SALE = ("on-sale", "Sort by on sale", True)
    POPULARITY = ("popularity", "Sort by popularity", True)
    PRICE_LOW_TO_HGIH = ("price-low", "Sort by price: low to high", True)
    PRICE_HIGH_TO_LOW = ("price-high", "Sort by price: high to low", True)
    AVG_RATING = ("avg-rating", "Sort by average rating", False)

    def __init__(self, value, label, is_public):
        self._value_ = value
        self.label = label
        self.is_public = is_public


class BookQuery(QueryPaging):
    sort_option: BookSortOption
    category_name: str | None = None
    author_name: str | None = None
    rating_star: int | None = None


class BookBase(SQLModel):
    book_title: str = Field(nullable=False, max_length=255, index=True)
    book_summary: str = Field()
    book_price: Decimal = Field(default=0, max_digits=5, decimal_places=2)
    book_cover_photo: Optional[str] = Field(max_length=20)


class BookOutput(SQLModel):
    id: int
    book_title: str
    book_price: Decimal
    author_name: str
    category_name: str
    book_cover_photo: Optional[str]
    is_on_sale: bool
    final_price: Optional[Decimal] = Field(default=None)
    total_review: Optional[int] = Field(default=0)
    rating_star: Optional[float] = Field(default=None)

    class Config:
        json_encoders = {
            Decimal: lambda v: get_currency(v)
        }


class BookSearchOutput(BookOutput):
    discount_offset: Optional[Decimal] = Field(default=None)


class BookDetailOutput(BookSearchOutput):
    book_summary: str
    review_count_by_rating: dict[int, int]


class Book(BookBase, table=True):
    __tablename__ = "book"
    id: Optional[int] = Field(default=None, primary_key=True)
    author_id: int = Field(nullable=False, foreign_key="author.id")
    author: "Author" = Relationship(back_populates="books")
    category_id: int = Field(nullable=False, foreign_key="category.id")
    category: "Category" = Relationship(back_populates="books")
    discounts: list["Discount"] = Relationship(back_populates="book")
    reviews: list["Review"] = Relationship(back_populates="book")
