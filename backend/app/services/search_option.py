from app.services.book import BookService
from app.models.search_option import SearchOptions
from app.services.review import ReviewService
from app.services.author import AuthorService
from app.services.category import CategoryService
from app.services.response import async_res_wrapper
from app.core.config import settings

class SearchOptionSerivce():
    def __init__(
        self,
        book_service: BookService,
        author_service: AuthorService,
        category_service: CategoryService,
        review_service: ReviewService
    ):
        self.book_service = book_service
        self.author_service = author_service
        self.category_service = category_service
        self.review_service = review_service

    @async_res_wrapper
    async def get_search_options(self) -> SearchOptions:
        return SearchOptions(
            author_names=await self.author_service.get_list_of_name(),
            category_names=await self.category_service.get_list_of_name(),
            rating_list=self.review_service.get_list_of_rating(),
            book_sort_options=self.book_service.get_sort_option(),
            review_sort_options=self.review_service.get_sort_option(),
            paging_options={
                str(key): f"{key} per page"
                for key in settings.ALLOWED_TAKE_AMOUNT
            }
        )
