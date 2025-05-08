from datetime import datetime, timezone
from decimal import Decimal
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Numeric, Relationship, SQLModel

from app.models.money import get_currency

if TYPE_CHECKING:
    from app.models import Book

class DiscountBase(SQLModel):
    discount_start_date: datetime = Field(
        default=datetime.now(timezone.utc), nullable=False
    )
    discount_end_date: datetime = Field(default=None, nullable=True)
    discount_price: Decimal = Field(
        max_digits=5, decimal_places=2, nullable=False, gt=0
    )

    class Config:
        json_encoders = {
            Decimal: lambda v: get_currency(v)
        }


class Discount(DiscountBase, table=True):
    __tablename__ = "discount"
    id: Optional[int] = Field(default=None, primary_key=True)
    book_id: int = Field(nullable=False, foreign_key="book.id")
    book: "Book" = Relationship(back_populates="discounts")
