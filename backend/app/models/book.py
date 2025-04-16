from sqlmodel import SQLModel, Numeric, Relationship, Field
from typing import Optional
from decimal import Decimal
from enum import Enum
class SortOption(Enum):
    ON_SALE = "on-sale"
    POPULARITY = "popularity"
    PRICE_LOW_TO_HGIHT = "price-low"
    PRICE_HIGHT_TO_LOW = "price-high"

class BookQueryInputDTO(SQLModel):
    offset: int
    limit: int
    sort_option: SortOption
    
    

class BookBase(SQLModel):
    book_title: str = Field(nullable=False, max_length=255, index=True)
    book_summary: str = Field()
    book_price: Decimal = Field(default=0,max_digits=5,decimal_places=2)
    book_cover_photo: str = Field(max_length=20)
    
class OnSaleBook(SQLModel):
    book_title: str 
    book_price: Decimal 
    book_cover_photo: str
    author_name: str 
    price_offset: Decimal = Field()
    max_discount_price: Decimal = Field()

class Book(BookBase, table=True):
    __tablename__ = "book"
    id: Optional[int] = Field(default=None, primary_key=True)
    author_id: int = Field(nullable=False, foreign_key="author.id")
    author: "Author" = Relationship(back_populates="books")
    category_id: int = Field(nullable=False, foreign_key="category.id")
    category: "Category" = Relationship(back_populates="books")
    discounts: list["Discount"] = Relationship(back_populates="book")    
    reviews: list["Review"] = Relationship(back_populates="book")    
