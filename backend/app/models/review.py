from sqlmodel import SQLModel, Relationship, Field
from typing import Optional
from datetime import datetime, timezone

MinRating = 1
MaxRating = 5

class ReviewBase(SQLModel):
    review_title: str = Field(max_length=120, nullable = False)
    review_details: str = Field(nullable=False)
    review_date: datetime = Field(default=datetime.now(timezone.utc))
    rating_start: str
    
class Review(ReviewBase, table=True):
    __tablename__ = "review"
    id: Optional[int] = Field(default=None, primary_key=True)
    book_id: int = Field(nullable=False, foreign_key="book.id")
    book: "Book" = Relationship(back_populates="reviews")
    