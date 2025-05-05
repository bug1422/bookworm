from math import ceil
from typing import TYPE_CHECKING

from app.core.config import settings
from app.models.paging import PagingResponse
from app.models.review import (
    Review,
    ReviewDetail,
    ReviewInput,
    ReviewQuery,
    ReviewSortOption,
)
from app.repository.review import ReviewRepository
from app.services.wrapper import res_wrapper

if TYPE_CHECKING:
    from app.services.book import BookService

class ReviewService:
    def __init__(self, repository: ReviewRepository):
        self.repository = repository

    @res_wrapper
    def get_review_count_by_rating(self, book_id: int) -> list[int, int]:
        return self.repository.get_review_count_by_rating(
            book_id, self.get_list_of_rating()
        )

    @res_wrapper
    def get_book_reviews(
        self, book_id: int, query_option: ReviewQuery
    ) -> PagingResponse[ReviewDetail]:
        reviews, max_items = self.repository.get_by_book_id(
            book_id=book_id,
            rating_star=query_option.rating_star,
            sort_option=query_option.sort_option,
            offset=(query_option.page - 1) * query_option.take,
            limit=query_option.take,
        )
        return PagingResponse[ReviewDetail](
            current_page=query_option.page,
            max_page=ceil(max_items / query_option.take),
            max_items=max_items,
            items=[ReviewDetail(**review.model_dump()) for review in reviews]
        )

    @res_wrapper
    def add_review(
        self, book_id: int, review_input: ReviewInput, book_service: "BookService"
    ) -> Review:
        book_res = book_service.get_by_id(book_id)
        if not book_res.is_success:
            raise book_res.exception
        book = book_res.result
        review = Review(
            book_id=book.id,
            review_title=review_input.review_title,
            review_details=review_input.review_details,
            rating_star=review_input.rating_star,
        )
        self.repository.add(review)
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
