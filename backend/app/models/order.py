from sqlmodel import SQLModel,Relationship, Field
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional
class OrderBase(SQLModel):
    order_date: datetime = Field(default=datetime.now(timezone.utc),nullable=False)
    order_amount: Decimal = Field(default=0,max_digits=8,decimal_places=2,nullable=False)
    
class Order(OrderBase, table=True):
    __tablename__ = "order"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(nullable=False,foreign_key="user.id")
    user: "User" = Relationship(back_populates="orders")
    order_items: list["OrderItem"] = Relationship(cascade_delete=True)
    