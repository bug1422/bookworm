from datetime import datetime, timezone
from decimal import Decimal
from typing import TYPE_CHECKING, Optional

from sqlmodel import Field, Numeric, Relationship, SQLModel

from app.core.config import settings
from app.models.money import get_currency

if TYPE_CHECKING:
    from app.models import Book


class OrderItemBase(SQLModel):
    quantity: int = Field(gt=0, nullable=False)
    price: Decimal = Field(
        default=0, max_digits=5, decimal_places=2, nullable=False
    )

    class Config:
        json_encoders = {
            Decimal: lambda v: get_currency(v)
        }




class OrderItemValidateInput(SQLModel):
    book_id: int = Field(default=None)
    quantity: int = Field(
        default=0, nullable=False
    )

    class Config:
        json_encoders = {
            Decimal: lambda v: get_currency(v)
        }




class OrderItemCheckoutInput(OrderItemValidateInput):
    cart_price: Optional[Decimal] = Field(default=None)


class OrderItemValidateOutput(OrderItemValidateInput):
    available: bool = Field(default=True)
    is_on_sale: bool = Field(default=False)
    author_name: Optional[str] = Field(default=None)
    book_id: Optional[int] = Field(default=None)
    book_title: Optional[str] = Field(default=None)
    book_cover_photo: Optional[str] = Field(default=None, max_length=20)
    book_price: Optional[Decimal] = Field(default=None)
    final_price: Optional[Decimal] = Field(default=None)
    total_price: Optional[Decimal] = Field(default=None)
    discount_start_date: Optional[datetime] = Field(default=None)
    discount_end_date: Optional[datetime] = Field(default=None)
    exception_details: list[str] = Field(default=[])


class OrderItem(OrderItemBase, table=True):
    __tablename__ = "order_item"
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(nullable=False, foreign_key="order.id")
    book_id: int = Field(nullable=False, foreign_key="book.id")
    book: "Book" = Relationship()
