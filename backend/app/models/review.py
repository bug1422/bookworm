from sqlmodel import SQLModel, Relationship, Field
from typing import Optional
from datetime import datetime, timezone
from enum import Enum
from app.core.config import settings
from app.models.paging import QueryPaging

MinRating = 1
MaxRating = 5


class ReviewSortOption(Enum):
    OLDEST_DATE = ("oldest-date", "Sort by date: oldest to newest")
    NEWEST_DATE = ("newest-date", "Sort by date: newest to oldest")
    
    def __init__(self,value,label):
        self._value_ = value
        self.label = label
        
    @property
    def label_name(self):
        return self.label


class ReviewBase(SQLModel):
    review_title: str = Field(max_length=120, nullable=False)
    review_details: str = Field(nullable=False)
    review_date: datetime = Field(default=datetime.now(timezone.utc))
    rating_start: str


class ReviewQuery(QueryPaging):
    star_rating: Optional[int] = Field(default=None)
    sort_option: ReviewSortOption = Field(default=ReviewSortOption.NEWEST_DATE)


class ReviewDetail(ReviewBase):
    id: Optional[int]


class Review(ReviewBase, table=True):
    __tablename__ = "review"
    id: Optional[int] = Field(default=None, primary_key=True)
    book_id: int = Field(nullable=False, foreign_key="book.id")
    book: "Book" = Relationship(back_populates="reviews")
