from sqlmodel import SQLModel, Numeric, Relationship, Field
from datetime import datetime, timezone
from typing import Optional
from decimal import Decimal

class OrderItemBase(SQLModel):
    quantity: int = Field(gt=0, nullable=False)
    price: Decimal = Field(default=0,max_digits=5,decimal_places=2,nullable=False)
    
class OrderItem(OrderItemBase, table=True):
    __tablename__ = "order_item"
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(nullable=False, foreign_key="order.id")
    book_id: int = Field(nullable=False, foreign_key="book.id")
    book: "Book" = Relationship()
    