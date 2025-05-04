from app.repository.base import BaseRepository
from typing import Tuple
from sqlmodel import select, func, case as query_case, and_, desc, nulls_last
from sqlmodel.sql.expression import Select
from decimal import Decimal
from datetime import datetime, timezone
from app.models.book import Book, BookSortOption
from app.models.discount import Discount
from app.models.author import Author
from app.models.category import Category
from app.models.review import Review


class BookRepository(BaseRepository[Book]):
    def __init__(self, session):
        super().__init__(Book, session)

    def get_books(
        self,
        sort_option: BookSortOption = None,
        category_name: str = None,
        author_name: str = None,
        rating_star: str = None,
        offset: int = 0,
        limit: int = 0,
    ) -> Tuple[list[Tuple[Book, Decimal, Decimal, int, float]], int]:
        on_sale_sub = self.__get_on_sale_subquery()
        rating_sub = self.__get_review_subquery()
        discount_offset = (
            Book.book_price - on_sale_sub.c.max_discount_price
        ).label("discount_offset")
        final_price = query_case((on_sale_sub.c.max_discount_price != None,
                                  on_sale_sub.c.max_discount_price), else_=Book.book_price).label("final_price")
        query: Select = select(
            Book,
            discount_offset,
            final_price,
            rating_sub.c.total_review,
            rating_sub.c.average_rating,
        )
        query = query.join(Author)
        query = query.join(Category)
        query = query.join(
            on_sale_sub,
            onclause=on_sale_sub.c.book_id == Book.id,
            isouter=True,
        )
        query = query.join(
            rating_sub, onclause=rating_sub.c.book_id == Book.id, isouter=True
        )

        match sort_option:
            case BookSortOption.ON_SALE:
                query = query.where(discount_offset != None).order_by(
                    desc(discount_offset), final_price
                )
            case BookSortOption.POPULARITY:
                query = query.order_by(
                    nulls_last(desc(rating_sub.c.total_review)), final_price
                )
            case BookSortOption.PRICE_LOW_TO_HGIH:
                query = query.order_by(final_price)
            case BookSortOption.PRICE_HIGH_TO_LOW:
                query = query.order_by(desc(final_price))
            case BookSortOption.AVG_RATING:
                query = query.order_by(
                    nulls_last(desc(rating_sub.c.average_rating)), final_price
                )
        if category_name:
            query = query.where(Category.category_name == category_name)
        if author_name:
            query = query.where(Author.author_name == author_name)
        if rating_star:
            query = query.where(
                and_(
                    rating_sub.c.average_rating != None,
                    rating_sub.c.average_rating >= int(rating_star),
                )
            )
        max_entries = self.session.scalar(
            select(func.count()).select_from(query.subquery())
        )
        query = query.offset(offset).limit(limit)
        books = self.session.exec(query).all()
        return books, max_entries

    def get_book_detail(
        self, book_id: int
    ) -> Tuple[Book, Decimal, Decimal, int, float] | None:
        on_sale_sub = self.__get_on_sale_subquery(book_id)
        rating_sub = self.__get_review_subquery(book_id)
        discount_offset = (
            Book.book_price - on_sale_sub.c.max_discount_price
        ).label("discount_offset")
        final_price = query_case((on_sale_sub.c.max_discount_price.isnot(None),
            on_sale_sub.c.max_discount_price), else_=Book.book_price).label("final_price")
        query: Select = select(
            Book,
            discount_offset,
            final_price,
            rating_sub.c.total_review,
            rating_sub.c.average_rating,
        )
        query = query.join(Author)
        query = query.join(Category)
        query = query.join(
            on_sale_sub,
            onclause=on_sale_sub.c.book_id == Book.id,
            isouter=True,
        )
        query = query.join(
            rating_sub, onclause=rating_sub.c.book_id == Book.id, isouter=True
        )
        query = query.where(
            Book.id == book_id)
        book = self.session.exec(query).first()
        return book

    def get_book_max_discount(self,book_id:int) -> Tuple[Decimal,datetime,datetime]:
        on_sale_sub = self.__get_on_sale_subquery(book_id)
        final_price = query_case((on_sale_sub.c.max_discount_price.isnot(None),
            on_sale_sub.c.max_discount_price), else_=Book.book_price).label("final_price")
        query: Select = select(
            final_price,
            Book.id,
            Discount.discount_start_date,
            Discount.discount_end_date
        )
        query = query.join(
            on_sale_sub,
            onclause=on_sale_sub.c.book_id == Book.id,
            isouter=True,
        )
        query = query.where(Book.id == book_id)
        final_price,_,start_date,end_date = self.session.exec(query).first()
        return final_price,start_date,end_date
    
    # region Subquery
    def __get_on_sale_subquery(self, book_id: int = None):
        today = datetime.now(timezone.utc)
        available_discount_subquery = (
            select(
                Discount.book_id,
                func.max(Discount.discount_price).label("max_discount_price"),
            )
            .where(
                and_(
                    Discount.discount_start_date <= today,
                    (Discount.discount_end_date == None)
                    | (Discount.discount_end_date >= today),
                )
            )
            .group_by(Discount.book_id)
        )
        if book_id:
            available_discount_subquery.where(Discount.book_id == book_id)
        return available_discount_subquery.subquery()

    def __get_review_subquery(self, book_id: int = None):

        avg_rating = (
            (
                1 * func.count(query_case((Review.rating_star == 1, 1)))
                + 2 * func.count(query_case((Review.rating_star == 2, 1)))
                + 3 * func.count(query_case((Review.rating_star == 3, 1)))
                + 4 * func.count(query_case((Review.rating_star == 4, 1)))
                + 5 * func.count(query_case((Review.rating_star == 5, 1)))
            )
            / func.coalesce(func.count(Review.rating_star), 1)
        ).label("average_rating")
        total_review = func.count(Review.book_id).label("total_review")
        book_rating_subquery = select(
            Review.book_id, total_review, avg_rating
        ).group_by(Review.book_id)
        if book_id:
            book_rating_subquery = book_rating_subquery.where(
                Review.book_id == book_id
            )
        return book_rating_subquery.subquery()

    # endregion
