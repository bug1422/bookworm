from app.services.base import BaseService
from app.repository.discount import DiscountRepository
from app.repository.book import BookRepository
from app.models.review import ReviewBase
from app.models.book import BookQuery, Book, BookPreview, BookSearchResult, BookDetail, BookSearchOption, SortOption
from app.services.review import ReviewService
from app.services.author import AuthorService
from app.services.category import CategoryService
from app.services.response import async_res_wrapper
from decimal import Decimal


class BookService(BaseService[BookRepository]):
    def __init__(self, book_repo: BookRepository):
        super().__init__(book_repo)

    @async_res_wrapper
    async def get_top_on_sale(self, limit: int = 10) -> list[BookSearchResult]:
        books = await self.repository.get_books(
            SortOption.ON_SALE, limit=limit)
        return [
            self.__map_to_search_result(
                book, discount_offset,
                final_price, total_review, avg_rating)
            for book, discount_offset, final_price, total_review, avg_rating in books
        ]

    @async_res_wrapper
    async def get_book_detail(self, book_id: int) -> BookDetail:
        book, final_price = await self.repository.get_book_detail(book_id)
        if not book:
            raise Exception("Book not found")
        return self.__map_to_detail(book, final_price)

    @async_res_wrapper
    async def get_books(self, query_option: BookQuery) -> list[BookSearchResult]:
        books = await self.repository.get_books(
            sort_option=query_option.sort_option,
            category_name=query_option.category_name,
            author_name=query_option.author_name,
            rating_star=query_option.rating_star,
            offset=(query_option.page-1) * query_option.take,
            limit=query_option.take
        )
        return [
            self.__map_to_search_result(book, discount_offset,
                                        final_price, total_review, avg_rating)
            for book, discount_offset, final_price, total_review, avg_rating in books
        ]

    @async_res_wrapper
    async def get_book_search_option(
        self,
        author_service: AuthorService,
        category_service: CategoryService
    ) -> BookSearchOption:
        from app.models.review import MinRating, MaxRating
        author_names_res = await author_service.get_list_of_name()
        category_names_res = await category_service.get_list_of_name()
        if not author_names_res.is_success:
            raise author_names_res.exception
        elif not category_names_res.is_success:
            raise category_names_res.exception
        return BookSearchOption(
            author_names=author_names_res.result,
            category_names=category_names_res.result,
            min_rating=MinRating,
            max_rating=MaxRating
        )

    def __map_to_preview(self, book: Book, final_price: Decimal) -> BookPreview:
        return BookPreview(
            **book.model_dump(include=["book_title", "book_price", "book_cover_photo"]),
            category_name=book.category.category_name,
            author_name=book.author.author_name,
            final_price=final_price,
        )

    def __map_to_search_result(self, book: Book, discount_offset: Decimal, final_price: Decimal, total_review: int, avg_rating: float) -> BookSearchResult:
        return BookSearchResult(
            **self.__map_to_preview(book, final_price).model_dump(),
            discount_offset=discount_offset,
            star_rating=avg_rating,
            total_review=total_review
        )

    def __map_to_detail(self, book: Book, final_price: Decimal) -> BookDetail:
        return BookDetail(
            **self.__map_to_preview(book, final_price).model_dump(),
            book_summary=book.book_summary
        )
