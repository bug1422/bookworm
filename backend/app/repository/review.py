from app.repository.base import BaseRepository
from sqlmodel import select, func, desc, Integer
from app.models.review import Review, ReviewQuery, ReviewSortOption
from typing import Tuple

class ReviewRepository(BaseRepository[Review]):
    def __init__(self, session):
        super().__init__(Review, session)

    def get_review_count_by_rating(
        self, book_id: int, rating_list: list[int] = []
    ) -> dict[int, int]:
        query = (
            select(
                Review.rating_star,
                func.coalesce(func.count(Review.rating_star), 0),
            )
            .where(Review.book_id == book_id)
            .group_by(Review.rating_star)
        )
        review_counts = self.session.exec(query).all()
        result = {key: 0 for key in rating_list}
        for rating_start, review_count in review_counts:
            result[rating_start] = review_count
        return result

    def get_by_book_id(
        self, book_id: int, query_option: ReviewQuery
    ) -> Tuple[list[Review], int]:
        query = select(Review).where(Review.book_id == book_id)
        if query_option.rating_star:
            query = query.where(
                Review.rating_star
                == query_option.rating_star
            )
        match query_option.sort_option:
            case ReviewSortOption.NEWEST_DATE:
                query = query.order_by(desc(Review.review_date))
            case ReviewSortOption.OLDEST_DATE:
                query = query.order_by(Review.review_date)
        max_entries = self.session.scalar(
            select(func.count()).select_from(query.subquery())
        )
        result = self.session.exec(query).all()
        return result, max_entries
