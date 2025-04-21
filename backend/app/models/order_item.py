from sqlmodel import SQLModel, Numeric, Relationship, Field
from datetime import datetime, timezone
from typing import Optional
from decimal import Decimal
from app.core.config import settings

class OrderItemBase(SQLModel):
    quantity: int = Field(gt=0, nullable=False)
    price: Decimal = Field(default=0,max_digits=5,decimal_places=2,nullable=False)
    
class OrderItemInput(SQLModel):
    book_id: Optional[int] = Field(default=None)
    discount_id: Optional[int] = Field(default=None)
    cart_price: Decimal = Field(default=0,nullable=False)
    quantity: int = Field(default=0, ge=1,le=settings.MAX_ITEM_QUANTITY, nullable=False)
    
class OrderItemValidateOutput(OrderItemInput):
    available: bool = Field(default=False)
    book_price: Optional[Decimal] = Field(default=None)
    final_price: Optional[Decimal] = Field(default=None)
    exception_details: list[str] = Field(default=[])    
    
class OrderItem(OrderItemBase, table=True):
    __tablename__ = "order_item"
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(nullable=False, foreign_key="order.id")
    book_id: int = Field(nullable=False, foreign_key="book.id")
    book: "Book" = Relationship()
    