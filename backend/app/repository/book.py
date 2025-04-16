from app.repository.base import BaseRepository
from sqlmodel import select, func, and_, desc
from app.models.book import Book, OnSaleBook


class BookRepository(BaseRepository[Book]):
    def __init__(self, session):
        super().__init__(Book, session)

    async def get_by_title(self, title: str) -> Book | None:
        return self.session.exec(select(Book).where(Book.book_title == title)).first()

    async def get_book_on_discount(self, limit: int):
        from app.models.discount import Discount
        from datetime import datetime, timezone
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
        price_offset = (Book.book_price -
                        available_discount_subquery.c.max_discount_price).label("price_offset")
        top_on_sale_books = self.session.exec(
            select(Book, price_offset, available_discount_subquery.c.max_discount_price.label("max_discount_price"))
            .join(
                available_discount_subquery,
                onclause=(Book.id == available_discount_subquery.c.book_id))
            .order_by(desc(price_offset))
            .limit(limit)
        ).all()
        return top_on_sale_books
