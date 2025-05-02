from app.core.image import get_image_url
from app.repository.book import BookRepository
from app.models.paging import PagingResponse
from app.models.exception import NotFoundException
from app.models.book import (
    BookQuery,
    Book,
    BookOutput,
    BookSearchOutput,
    BookDetailOutput,
    BookSortOption,
)
from app.services.review import ReviewService
from app.services.wrapper import res_wrapper
from decimal import Decimal
from math import ceil


class BookService:
    def __init__(self, repository: BookRepository):
        self.repository = repository

    @res_wrapper
    def get_by_id(self, id: int) -> Book:
        return self.repository.get_by_id(id)

    @res_wrapper
    def get_top_on_sale(self, limit: int = 10) -> list[BookSearchOutput]:
        books, _ = self.repository.get_books(
            BookSortOption.ON_SALE, limit=limit
        )
        return [
            self.__map_to_search_result(
                book, discount_offset, final_price, total_review, avg_rating
            )
            for book, discount_offset, final_price, total_review, avg_rating in books
        ]

    @res_wrapper
    def get_recommended_books(
        self, limit: int = 8
    ) -> list[BookSearchOutput]:
        books, _ = self.repository.get_books(
            BookSortOption.AVG_RATING, limit=limit
        )
        return [
            self.__map_to_search_result(
                book, discount_offset, final_price, total_review, avg_rating
            )
            for book, discount_offset, final_price, total_review, avg_rating in books
        ]

    @res_wrapper
    def get_popular_books(
        self, limit: int = 8
    ) -> list[BookSearchOutput]:
        books, _ = self.repository.get_books(
            BookSortOption.POPULARITY, limit=limit
        )
        return [
            self.__map_to_search_result(
                book, discount_offset, final_price, total_review, avg_rating
            )
            for book, discount_offset, final_price, total_review, avg_rating in books
        ]

    @res_wrapper
    def get_books(
        self, query_option: BookQuery
    ) -> PagingResponse[BookSearchOutput]:
        books, max_items = self.repository.get_books(
            sort_option=query_option.sort_option,
            category_name=query_option.category_name,
            author_name=query_option.author_name,
            rating_star=query_option.rating_star,
            offset=(query_option.page - 1) * query_option.take,
            limit=query_option.take,
        )
        return PagingResponse[BookSearchOutput](
            current_page=query_option.page,
            max_page=ceil(max_items / query_option.take),
            max_items=max_items,
            items=[
                self.__map_to_search_result(
                    book,
                    discount_offset,
                    final_price,
                    total_review,
                    avg_rating,
                )
                for book, discount_offset, final_price, total_review, avg_rating in books
            ],
        )

    @res_wrapper
    def get_book_detail(
        self, book_id: int, review_service: ReviewService
    ) -> BookDetailOutput:
        book_detail = self.repository.get_book_detail(book_id)
        if not book_detail:
            raise NotFoundException("Book detail")
        (
            book,
            discount_offset,
            final_price,
            total_review,
            avg_rating,
        ) = book_detail
        review_count_result = review_service.get_review_count_by_rating(
            book_id
        )
        if not review_count_result.is_success:
            raise review_count_result.exception
        return self.__map_to_detail(
            book,
            discount_offset,
            final_price,
            total_review,
            avg_rating,
            review_count_result.result,
        )

    def get_sort_option(
        self,
    ) -> dict[str, str]:
        return {
            key.value: key.label for key in BookSortOption if key.is_public
        }

    def __map_to_preview(
        self,
        book: Book,
        final_price: Decimal,
        total_review: int,
        avg_rating: float,
    ) -> BookOutput:
        return BookOutput(
            **book.model_dump(
                include=["id", "book_title", "book_price"]
            ),
            book_cover_photo=get_image_url("books", book.book_cover_photo),
            category_name=book.category.category_name,
            author_name=book.author.author_name,
            final_price=final_price,
            rating_star=round(avg_rating, 1) if avg_rating else None,
            total_review=total_review if total_review else 0,
        )

    def __map_to_search_result(
        self,
        book: Book,
        discount_offset: Decimal,
        final_price: Decimal,
        total_review: int,
        avg_rating: float,
    ) -> BookSearchOutput:
        return BookSearchOutput(
            **self.__map_to_preview(
                book, final_price, total_review, avg_rating
            ).model_dump(),
            discount_offset=discount_offset,
        )

    def __map_to_detail(
        self,
        book: Book,
        discount_offset: Decimal,
        final_price: Decimal,
        total_review: int,
        avg_rating: float,
        review_count_by_rating,
    ) -> BookDetailOutput:
        return BookDetailOutput(
            **self.__map_to_search_result(
                book, discount_offset, final_price, total_review, avg_rating
            ).model_dump(),
            book_summary=book.book_summary,
            review_count_by_rating=review_count_by_rating,
        )
