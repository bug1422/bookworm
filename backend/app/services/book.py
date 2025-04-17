from app.services.base import BaseService
from app.repository.discount import DiscountRepository
from app.repository.book import BookRepository
from app.models.book import BookQuery, Book, BookPreview, SortOption
from app.services.response import async_res_wrapper
from decimal import Decimal

class BookService(BaseService[BookRepository]):
    def __init__(self, book_repo: BookRepository):
        super().__init__(book_repo)

    @async_res_wrapper
    async def get_top_on_sale(self, limit: int = 10) -> list[BookPreview]:
        books = await self.repository.get_books(
            SortOption.ON_SALE, limit=limit)
        return [
            self.__map_to_preview(book, discount_offset, max_discount_price, total_review, avg_rating)
            for book, discount_offset, max_discount_price, total_review, avg_rating in books
        ]

    @async_res_wrapper
    async def get_books(self, query_option: BookQuery) -> list[BookPreview]:
        books = await self.repository.get_books(
            sort_option=query_option.sort_option,
            category_name=query_option.category_name,
            author_name=query_option.author_name,
            rating_star=query_option.rating_star,
            offset=(query_option.page-1) * query_option.take,
            limit=query_option.take
        )
        return [
            self.__map_to_preview(book, discount_offset, max_discount_price, total_review, avg_rating)
            for book, discount_offset, max_discount_price, total_review, avg_rating in books
        ]


    def __map_to_preview(self, book: Book, discount_offset: Decimal, max_discount_price: Decimal, total_review: int, avg_rating: float)->BookPreview:
        return BookPreview(
            book_title=book.book_title,
            book_price=book.book_price,
            book_cover_photo=book.book_cover_photo,
            author_name=book.author.author_name,
            discount_offset=discount_offset,
            max_discount_price=max_discount_price,
            star_rating=avg_rating,
            total_review=total_review
        )