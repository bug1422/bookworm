from sqlmodel import Session, select, func
from app.models import Book, Category, Author, Discount, Review
from app.tests.data import categories, authors, books, discounts, reviews
import pytest


@pytest.fixture(scope="module")
def seed_categories(db_session):
    db_session.add_all(categories)
    db_session.commit()
    result = db_session.execute(select(func.count()).select_from(Category))
    count = result.scalar()
    assert count == len(categories)


@pytest.fixture(scope="module")
def seed_authors(db_session):
    db_session.add_all(authors)
    db_session.commit()
    result = db_session.execute(select(func.count()).select_from(Author))
    count = result.scalar()
    assert count == len(authors)


@pytest.fixture(scope="module")
def seed_books(seed_categories, seed_authors, db_session):
    db_session.add_all(books)
    db_session.commit()
    result = db_session.execute(select(func.count()).select_from(Book))
    count = result.scalar()
    assert count == len(books)

@pytest.fixture(scope="module")
def seed_discounts( seed_books, db_session):
    db_session.add_all(discounts)
    db_session.commit()
    result = db_session.execute(select(func.count()).select_from(Discount))
    count = result.scalar()
    assert count == len(discounts)

@pytest.fixture(scope="module")
def seed_reviews( seed_books, db_session):
    db_session.add_all(reviews)
    db_session.commit()
    result = db_session.execute(select(func.count()).select_from(Review))
    count = result.scalar()
    assert count == len(reviews)

