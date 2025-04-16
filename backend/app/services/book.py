from app.services.base import BaseService
from app.repository.book import BookRepository
from app.models.book import Book, OnSaleBook
from app.services.response import async_res_wrapper


class BookService(BaseService[BookRepository]):
    def __init__(self, session):
        super().__init__(BookRepository(session))

    @async_res_wrapper
    async def get_top_on_sale(self, limit: int = 10) -> list[OnSaleBook]:
        books = await self.repository.get_book_on_discount(limit)
        return [
            OnSaleBook(
                **book.model_dump(),
                author_name=book.author.author_name,
                price_offset=price_offset,
                max_discount_price=max_discount_price
            )
            for book,price_offset,max_discount_price in books
        ]
