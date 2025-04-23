from app.models import Book, Category, Author, Discount, Review
from datetime import datetime, timezone, timedelta
categories = [
    Category(id=1, category_name="Fiction", category_desc="..."),
    Category(id=2, category_name="Self-care", category_desc="..."),
]

authors = [
    Author(id=1, author_name="Author A", author_bio="..."),
    Author(id=2, author_name="Author B", author_bio="..."),
]

books = [
    Book(id=1, category_id=categories[0].id, author_id=authors[0].id, book_title="A",
         book_summary="...", book_price=100, book_cover_photo="img.png"),
    Book(id=2, category_id=categories[1].id, author_id=authors[0].id, book_title="B",
         book_summary="...", book_price=160, book_cover_photo="img.png"),
    Book(id=3, category_id=categories[0].id, author_id=authors[1].id, book_title="C",
         book_summary="...", book_price=50, book_cover_photo="img.png"),
    Book(id=4, category_id=categories[1].id, author_id=authors[1].id, book_title="D",
         book_summary="...", book_price=70, book_cover_photo="img.png"),
]

now = datetime.now(timezone.utc)
discounts = [
    Discount(id=1, book_id=1, discount_start_date=now -
             timedelta(days=1), discount_end_date=None, discount_price=20),
    Discount(id=2, book_id=2, discount_start_date=now -
             timedelta(days=1), discount_end_date=None, discount_price=30),
    Discount(id=3, book_id=3, discount_start_date=now -
             timedelta(days=1), discount_end_date=None, discount_price=40),
]

reviews = [
    Review(id=1, book_id=1, review_title=".", review_details="...", rating_star=4),
    Review(id=2, book_id=2, review_title=".", review_details="...", rating_star=4),
    Review(id=3, book_id=2, review_title=".", review_details="...", rating_star=1),
    Review(id=4, book_id=2, review_title=".", review_details="...", rating_star=1),
    Review(id=5, book_id=2, review_title=".", review_details="...", rating_star=1),
    Review(id=6, book_id=2, review_title=".", review_details="...", rating_star=1),
    Review(id=7, book_id=3, review_title=".", review_details="...", rating_star=4),
]
