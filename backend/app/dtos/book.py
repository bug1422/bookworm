from pydantic import BaseModel
from decimal import Decimal
from app.models.book import OnSaleBook
class BookInputDTO(BaseModel):
    0
    
class OnSaleBookDTO(BaseModel):
    book_title: str 
    author_name: str
    book_price: Decimal 
    discount_price: Decimal
    price_offset: Decimal     
    book_cover_photo: str

    @classmethod
    def from_orm(cls, book: OnSaleBook):
        return cls(
            book_title = book.book_title,
            author_name = book.author_name,
            book_price = book.book_price,
            book_cover_photo = book.book_cover_photo,
            price_offset = book.price_offset,
            discount_price = book.max_discount_price,
        )
    