from app.services.base import BaseService
from app.repository.review import ReviewRepository
from app.models.review import ReviewDetail, ReviewQuery, ReviewSortOption, MinRating, MaxRating
from app.services.response import async_res_wrapper

class ReviewService(BaseService[ReviewRepository]):
    def __init__(self, review_repo: ReviewRepository):
        super().__init__(review_repo)

    @async_res_wrapper
    async def get_review_count_by_rating(self, book_id: int) -> list[str, int]:
        return await self.repository.get_review_count_by_rating(book_id, self.get_list_of_rating())

    @async_res_wrapper
    async def get_book_reviews(self,book_id: int, query_option: ReviewQuery) -> list[ReviewDetail]:
        reviews = await self.repository.get_by_book_id(book_id, query_option)
        return [ReviewDetail(**review.model_dump()) for review in reviews]
    
    def get_list_of_rating(self):
        return [
            str(rating_start) for rating_start in range(MinRating, MaxRating+1)
        ]
        
    def get_sort_option(self) -> list[str, str]:
        return {
            key.value: key.label
            for key in ReviewSortOption
        }
