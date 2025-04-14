from sqlmodel import SQLModel,Numeric, Relationship, Field
from typing import Optional
from datetime import datetime, timezone
class ReviewBase(SQLModel):
    review_title: str = Field(max_length=120, nullable = False)
    review_details: str = Field(nullable=False)
    review_date: datetime = Field(default=datetime.now(timezone.utc))
    rating_start: str
    
class Review(ReviewBase):
    id: Optional[int] = Field(default=None, primary_key=True)
    book_id: int = Field(nullable=False, foreign_key="book.id")
    book: "Book" = Relationship(back_populates="reviews")
    