from app.repository.review import ReviewRepository
from app.models.review import (
    Review,
    ReviewDetail,
    ReviewQuery,
    ReviewInput,
    ReviewSortOption,
)
from app.models.paging import PagingResponse
from app.services.wrapper import async_res_wrapper
from app.core.config import settings
from math import ceil


class ReviewService:
    def __init__(self, repository: ReviewRepository):
        self.repository = repository

    @async_res_wrapper
    async def get_review_count_by_rating(self, book_id: int) -> list[int, int]:
        return await self.repository.get_review_count_by_rating(
            book_id, self.get_list_of_rating()
        )

    @async_res_wrapper
    async def get_book_reviews(
        self, book_id: int, query_option: ReviewQuery
    ) -> PagingResponse[ReviewDetail]:
        reviews, max_items = await self.repository.get_by_book_id(book_id, query_option)
        return PagingResponse[ReviewDetail](
            current_page=query_option.page,
            max_page=ceil(max_items / query_option.take),
            max_items=max_items,
            items=[ReviewDetail(**review.model_dump()) for review in reviews]
        )

    @async_res_wrapper
    async def add_review(
        self, book_id: int, review_input: ReviewInput, book_service: "BookService"
    ) -> Review:
        book_res = await book_service.get_by_id(book_id)
        if not book_res.is_success:
            raise book_res.exception
        book = book_res.result
        review = Review(**review_input.model_dump(), book_id=book.id)
        await self.repository.add(review)
        self.repository.commit()
        self.repository.refresh(review)
        return review

    def get_list_of_rating(self):
        return [
            rating_star
            for rating_star in range(
                settings.MIN_REVIEW_RATING, settings.MAX_REVIEW_RATING + 1
            )
        ]

    def get_sort_option(self) -> list[str, str]:
        return {key.value: key.label for key in ReviewSortOption}
