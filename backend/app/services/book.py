from app.services.base import BaseService
from app.repository.discount import DiscountRepository
from app.repository.book import BookRepository
from app.models.review import ReviewBase
from app.models.paging import PagingResponse
from app.models.book import BookQuery, Book, BookPreview, BookSearchResult, BookDetail, BookSortOption
from app.services.review import ReviewService
from app.services.author import AuthorService
from app.services.category import CategoryService
from app.services.response import async_res_wrapper
from decimal import Decimal
from math import ceil


class BookService(BaseService[BookRepository]):
    def __init__(self, book_repo: BookRepository):
        super().__init__(book_repo)

    @async_res_wrapper
    async def get_top_on_sale(self, limit: int = 10) -> list[BookSearchResult]:
        books, _ = await self.repository.get_books(
            BookSortOption.ON_SALE, limit=limit)
        return [
            self.__map_to_search_result(
                book, discount_offset,
                final_price, total_review, avg_rating)
            for book, discount_offset, final_price, total_review, avg_rating in books
        ]

    @async_res_wrapper
    async def get_recommended_books(self, limit: int = 8) -> list[BookSearchResult]:
        books, _ = await self.repository.get_books(
            BookSortOption.AVG_RATING, limit=limit)
        return [
            self.__map_to_search_result(
                book, discount_offset,
                final_price, total_review, avg_rating)
            for book, discount_offset, final_price, total_review, avg_rating in books
        ]

    @async_res_wrapper
    async def get_popular_books(self, limit: int = 8) -> list[BookSearchResult]:
        books, _ = await self.repository.get_books(
            BookSortOption.POPULARITY, limit=limit)
        return [
            self.__map_to_search_result(
                book, discount_offset,
                final_price, total_review, avg_rating)
            for book, discount_offset, final_price, total_review, avg_rating in books
        ]

    @async_res_wrapper
    async def get_books(self, query_option: BookQuery) -> PagingResponse[BookSearchResult]:
        books, max_entries = await self.repository.get_books(
            sort_option=query_option.sort_option,
            category_name=query_option.category_name,
            author_name=query_option.author_name,
            rating_star=query_option.rating_star,
            offset=(query_option.page-1) * query_option.take,
            limit=query_option.take
        )
        return PagingResponse[BookSearchResult](
            current_page=query_option.page,
            max_page=ceil(max_entries / query_option.take),
            items=[
                self.__map_to_search_result(book, discount_offset,
                                            final_price, total_review, avg_rating)
                for book, discount_offset, final_price, total_review, avg_rating in books
            ])

    @async_res_wrapper
    async def get_book_detail(self, book_id: int, review_service: ReviewService) -> BookDetail:
        book, final_price, total_review, avg_rating = await self.repository.get_book_detail(book_id)
        review_count_result = await review_service.get_review_count_by_rating(book_id)
        if not book:
            raise Exception("Book not found")
        elif not review_count_result.is_success:
            raise review_count_result.exception
        return self.__map_to_detail(book, final_price, total_review, avg_rating, review_count_result.result)

    def get_sort_option(
        self,
    ) -> dict[str, str]:
        return {
            key.value: key.label
            for key in BookSortOption
            if key.is_public
        }

    def __map_to_preview(self, book: Book, final_price: Decimal, total_review: int, avg_rating: float) -> BookPreview:
        return BookPreview(
            **book.model_dump(include=["book_title", "book_price", "book_cover_photo"]),
            category_name=book.category.category_name,
            author_name=book.author.author_name,
            final_price=final_price,
            star_rating=avg_rating,
            total_review=total_review
        )

    def __map_to_search_result(self, book: Book, discount_offset: Decimal, final_price: Decimal, total_review: int, avg_rating: float) -> BookSearchResult:
        return BookSearchResult(
            **self.__map_to_preview(book, final_price, total_review, avg_rating).model_dump(),
            discount_offset=discount_offset,

        )

    def __map_to_detail(self, book: Book, final_price: Decimal, total_review: int, avg_rating: float, review_count_by_rating) -> BookDetail:
        return BookDetail(
            **self.__map_to_preview(book, final_price, total_review, avg_rating).model_dump(),
            book_summary=book.book_summary,
            review_count_by_rating=review_count_by_rating
        )
