from app.repository.base import BaseRepository
from sqlmodel import select, func, case, and_, desc, Integer, nulls_last
from sqlmodel.sql.expression import Select
from typing import Tuple
from decimal import Decimal
from app.models.book import Book, SortOption
from app.models.author import Author
from app.models.category import Category


class BookRepository(BaseRepository[Book]):
    def __init__(self, session):
        super().__init__(Book, session)

    async def get_book_detail(
        self,
        book_id: int
    ) -> Tuple[Book, Decimal]:
        on_sale_sub = self.__get_on_sale_subquery()
        final_price = case((on_sale_sub.c.max_discount_price > Book.book_price,
                           on_sale_sub.c.max_discount_price), else_=Book.book_price).label("final_price")
        query: Select = select(
            Book,
            final_price
        ).join(Author).join(Category).where(Book.id == book_id)
        book = self.session.exec(query).first()
        return book

    async def get_books(
        self,
        sort_option: SortOption = None,
        category_name: str = None,
        author_name: str = None,
        rating_star: str = None,
        offset: int = 0,
        limit: int = 0,

    ) -> list[Tuple[Book, Decimal, Decimal, int, float]]:
        # first get all book with reviews and discount
        on_sale_sub = self.__get_on_sale_subquery()
        rating_sub = self.__get_review_subquery()
        discount_offset = (
            Book.book_price - on_sale_sub.c.max_discount_price).label("discount_offset")
        final_price = case((on_sale_sub.c.max_discount_price > Book.book_price,
                           on_sale_sub.c.max_discount_price), else_=Book.book_price).label("final_price")
        query: Select = select(
            Book,
            discount_offset,
            final_price,
            rating_sub.c.total_review,
            rating_sub.c.average_rating
        )
        query = query.join(Author)
        query = query.join(Category)
        query = query.join(
            on_sale_sub,
            onclause=on_sale_sub.c.book_id == Book.id,
            isouter=True
        )
        query = query.join(
            rating_sub,
            onclause=rating_sub.c.book_id == Book.id,
            isouter=True
        )

        match sort_option:
            case SortOption.ON_SALE:
                query = query.where(discount_offset != None).order_by(
                    desc(discount_offset),
                    final_price
                )
            case SortOption.POPULARITY:
                query = query.order_by(
                    nulls_last(desc(rating_sub.c.total_review)),
                    final_price
                )
            case SortOption.PRICE_LOW_TO_HGIH:
                query = query.order_by(final_price)
            case SortOption.PRICE_HIGH_TO_LOW:
                query = query.order_by(desc(final_price))
        if category_name:
            query = query.where(Category.category_name == category_name)
        if author_name:
            query = query.where(Author.author_name == author_name)
        if rating_star:
            query = query.where(and_(rating_sub.c.average_rating != None, func.cast(
                rating_sub.c.average_rating, Integer) >= int(rating_star)))
        query = query.offset(offset).limit(limit)
        books = self.session.exec(query).all()
        return books

    # region Subquery

    def __get_on_sale_subquery(self):
        from datetime import datetime, timezone
        from app.models.discount import Discount
        today = datetime.now(timezone.utc)
        available_discount_subquery = select(
            Discount.book_id, func.max(
                Discount.discount_price).label("max_discount_price")
        ).where(
            and_(
                Discount.discount_start_date <= today,
                (Discount.discount_end_date == None) | (
                    Discount.discount_end_date >= today)
            )
        ).group_by(Discount.book_id).subquery()
        return available_discount_subquery

    def __get_review_subquery(self):
        from app.models.review import Review
        avg_rating = (
            (1 * func.count(case((Review.rating_start == "1", 1))) +
             2 * func.count(case((Review.rating_start == "2", 1))) +
             3 * func.count(case((Review.rating_start == "3", 1))) +
             4 * func.count(case((Review.rating_start == "4", 1))) +
             5 * func.count(case((Review.rating_start == "5", 1)))
             )/func.coalesce(
                func.count(Review.rating_start), 1
            )
        ).label("average_rating")
        total_review = func.count(Review.book_id).label("total_review")
        book_rating_subquery = select(
            Review.book_id, total_review, avg_rating).group_by(Review.book_id).subquery()
        return book_rating_subquery
    # endregion
