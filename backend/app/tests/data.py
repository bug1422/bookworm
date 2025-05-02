from app.models import Book, Category, Author, Discount, Review, User
from app.models.order import OrderItemInput, OrderInput
from datetime import datetime, timezone, timedelta
now = datetime.now(timezone.utc)

def get_categories():
    return [
        Category(category_name="Fiction", category_desc="..."),
        Category(category_name="Self-care", category_desc="..."),
    ]


def get_authors():
    return [
        Author(author_name="Author A", author_bio="..."),
        Author(author_name="Author B", author_bio="..."),
    ]


def get_books(categories,authors):
    return [
        Book(category_id=categories[0].id, author_id=authors[0].id, book_title="A",
             book_summary="...", book_price=100, book_cover_photo="img.png"),
        Book(category_id=categories[1].id, author_id=authors[0].id, book_title="B",
             book_summary="...", book_price=160, book_cover_photo="img.png"),
        Book(category_id=categories[0].id, author_id=authors[1].id, book_title="C",
             book_summary="...", book_price=50, book_cover_photo="img.png"),
        Book(category_id=categories[1].id, author_id=authors[1].id, book_title="D",
             book_summary="...", book_price=70, book_cover_photo="img.png"),
    ]

def get_new_category():
    return Category(category_name="Fiction", category_desc="...")

def get_new_author():
    return Author(author_name="Author A", author_bio="...")

def get_new_book(category,author):
    
    return Book(category_id=category.id, author_id=author.id, book_title="G",
                book_summary="...", book_price=100, book_cover_photo="img.png")

def get_new_discount(book):
    return Discount(book_id=book.id, discount_start_date=now -
             timedelta(days=1), discount_end_date=None, discount_price=20)


def get_discounts(books): 
    return [
    Discount(book_id=books[0].id, discount_start_date=now -
             timedelta(days=1), discount_end_date=None, discount_price=20),
    Discount(book_id=books[1].id, discount_start_date=now -
             timedelta(days=1), discount_end_date=None, discount_price=30),
    Discount(book_id=books[2].id, discount_start_date=now -
             timedelta(days=1), discount_end_date=None, discount_price=40),
]

def get_reviews(books):
    return [
    Review(book_id=books[0].id, review_title=".", review_details="...", rating_star=4),
    Review(book_id=books[1].id, review_title=".", review_details="...", rating_star=4),
    Review(book_id=books[2].id, review_title=".", review_details="...", rating_star=1),
    Review(book_id=books[0].id, review_title=".", review_details="...", rating_star=1),
    Review(book_id=books[1].id, review_title=".", review_details="...", rating_star=1),
    Review(book_id=books[2].id, review_title=".", review_details="...", rating_star=1),
    Review(book_id=books[0].id, review_title=".", review_details="...", rating_star=4),
]

def get_order_item_input(book_id,discount_id, cart_price,quantity):
    return OrderItemInput(book_id=book_id,discount_id=discount_id,cart_price=cart_price,quantity=quantity)

def get_order_input(input_items):
    return OrderInput(items=input_items)