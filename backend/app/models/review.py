from sqlmodel import SQLModel, Relationship, Field
from pydantic import field_validator
from typing import Optional
from datetime import datetime, timezone
from enum import Enum
from app.core.config import settings
from app.models.paging import QueryPaging


class ReviewSortOption(Enum):
    OLDEST_DATE = ("oldest-date", "Sort by date: oldest to newest")
    NEWEST_DATE = ("newest-date", "Sort by date: newest to oldest")

    def __init__(self, value, label):
        self._value_ = value
        self.label = label


class ReviewBase(SQLModel):
    review_title: str = Field(max_length=120, nullable=False)
    review_details: str = Field(nullable=True)
    review_date: datetime = Field(default=datetime.now(timezone.utc))
    rating_star: int = Field(
        default=settings.MIN_REVIEW_RATING, nullable=False
    )


class ReviewQuery(QueryPaging):
    rating_star: Optional[int] = Field(default=None)
    sort_option: ReviewSortOption = Field(default=ReviewSortOption.NEWEST_DATE)


class ReviewDetail(ReviewBase):
    id: Optional[int]


class ReviewInput(SQLModel):
    review_title: str = Field(nullable=False)
    review_details: str
    rating_star: int = Field(nullable=False)

    @field_validator("rating_star")
    @classmethod
    def enforce_in_range(cls, value):
        if not (
            value >= settings.MIN_REVIEW_RATING
            and value <= settings.MAX_REVIEW_RATING
        ):
            raise ValueError(
                f"rating must be from {settings.MIN_REVIEW_RATING} to {settings.MAX_REVIEW_RATING}"
            )
        return value


class Review(ReviewBase, table=True):
    __tablename__ = "review"
    id: Optional[int] = Field(default=None, primary_key=True)
    book_id: int = Field(nullable=False, foreign_key="book.id")
    book: "Book" = Relationship(back_populates="reviews")
