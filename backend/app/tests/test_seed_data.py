from fastapi.testclient import TestClient
from fastapi import status
from sqlmodel import Session, select, func
from app.models import Book, Category, Author, Discount, Review
from app.tests.data import *
import pytest


@pytest.fixture(scope="session")
def seed_categories(db_session):
    print('run category')
    categories = get_categories()
    db_session.add_all(categories)
    db_session.commit()
    for category in categories:
        db_session.refresh(category)
    yield categories


@pytest.fixture(scope="session")
def seed_authors(db_session):
    authors = get_authors()
    db_session.add_all(authors)
    db_session.commit()
    for author in authors:
        db_session.refresh(author)
    yield authors


@pytest.fixture(scope="session")
def seed_books(seed_categories, seed_authors, db_session):
    books = get_books(seed_categories, seed_authors)
    db_session.add_all(books)
    db_session.commit()
    for book in books:
        db_session.refresh(book)
    yield books


@pytest.fixture(scope="session")
def seed_discounts(seed_books, db_session):
    discounts = get_discounts(seed_books)
    db_session.add_all(discounts)
    db_session.commit()
    for discount in discounts:
        db_session.refresh(discount)
    yield discounts


@pytest.fixture(scope="session")
def seed_reviews(seed_books, db_session):
    reviews = get_reviews(seed_books)
    db_session.add_all(reviews)
    db_session.commit()
    for review in reviews:
        db_session.refresh(review)
    yield reviews


@pytest.fixture(scope="session")
def seed_add_review(db_session):
    category = get_new_category()
    db_session.add(category)
    author = get_new_author()
    db_session.add(author)
    db_session.commit()
    db_session.refresh(category)
    db_session.refresh(author)
    book = get_new_book(category, author)
    db_session.add(book)
    db_session.commit()
    db_session.refresh(book)
    yield book


@pytest.fixture(scope="session")
def seed_cart_item(db_session, seed_discounts):
    category = get_new_category()
    db_session.add(category)
    author = get_new_author()
    db_session.add(author)
    db_session.commit()
    db_session.refresh(category)
    db_session.refresh(author)
    book = get_new_book(category, author)
    db_session.add(book)
    db_session.commit()
    db_session.refresh(book)
    discount = get_new_discount(book)
    db_session.add(discount)
    db_session.commit()
    db_session.refresh(discount)
    yield book.id, discount.id, discount.discount_price


@pytest.fixture(scope="function")
def get_cart_item(seed_cart_item):
    book_id, discount_id, discount_price = seed_cart_item
    return get_order_item_input(
        book_id=book_id,
        discount_id=discount_id,
        cart_price=discount_price,
        quantity=2
    )


@pytest.fixture(scope="session")
def seed_user(test_client: TestClient, db_session: Session):
    response = test_client.post("/users/signup", data={
        "first_name": "def",
        "last_name": "abc",
        "email": "test@gmail.com",
        "password": "123",
        "is_admin": True
    })
    assert response.status_code == status.HTTP_201_CREATED
    user = db_session.exec(select(User)).first()
    yield user
