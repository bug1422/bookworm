from sqlmodel import SQLModel, Relationship, Field
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional
from pydantic import conlist, field_validator
from app.models.order_item import OrderItemInput, OrderItemValidateOutput


class OrderBase(SQLModel):
    order_date: datetime = Field(
        default=datetime.now(timezone.utc), nullable=False
    )
    order_amount: Decimal = Field(
        default=0, max_digits=8, decimal_places=2, nullable=False
    )


class OrderInput(SQLModel):
    items: conlist(OrderItemInput, min_length=1) = Field(default=[])

    @field_validator("items")
    @classmethod
    def validate_unique_item(cls, items: list[OrderItemInput]):
        if len(items) != set(len([item.book_id for item in items])):
            raise ValueError("List can't contain duplicate id")


class OrderValidateOutput(SQLModel):
    item_outputs: list[OrderItemValidateOutput] = Field(default=[])


class Order(OrderBase, table=True):
    __tablename__ = "order"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(nullable=False, foreign_key="user.id")
    user: "User" = Relationship(back_populates="orders")
    order_items: list["OrderItem"] = Relationship(cascade_delete=True)
