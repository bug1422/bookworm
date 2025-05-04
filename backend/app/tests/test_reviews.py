import pytest
from fastapi.testclient import TestClient
from fastapi import status
from app.tests.test_seed_data import *
from app.tests.common import *
from app.models.book import Book
from app.models.review import ReviewQuery, ReviewSortOption
from sqlmodel import select


def route_path(book_id):
    return f"/books/{book_id}/reviews"


def get_query_params(query: ReviewQuery):
    params = {
        "page": query.page,
        "take": query.take,
        "sort_option": query.sort_option.value,
    }
    if query.rating_star:
        params.update({"star_rating": query.rating_star, })
    return params


@pytest.mark.reviews
def test_query_book_reviews_with_rating_should_return_greater_rating(test_client: TestClient, db_session, seed_reviews):
    test_rating = 2
    query = ReviewQuery(rating_star=test_rating,
                        sort_option=ReviewSortOption.NEWEST_DATE)
    book = db_session.exec(select(Book)).first()
    book_reviews = book.reviews
    assert book_reviews != None and book_reviews != []
    response = test_client.get(route_path(
        book.id), params=get_query_params(query))
    assert response.status_code == status.HTTP_200_OK
    reviews = get_res_detail(response)["items"]
    assert len(reviews) != 0
    assert all([n.get("rating_star") for n in reviews])


@pytest.mark.reviews
def test_query_book_reviews_with_newest_date_should_return_desc_date(test_client: TestClient, db_session, seed_reviews):
    query = ReviewQuery(sort_option=ReviewSortOption.NEWEST_DATE)
    book = db_session.exec(select(Book)).first()
    book_reviews = book.reviews
    assert book_reviews != None and book_reviews != []
    response = test_client.get(route_path(
        book.id), params=get_query_params(query))
    assert response.status_code == status.HTTP_200_OK
    reviews = get_res_detail(response)["items"]
    assert len(reviews) != 0
    assert reviews == sorted(
        reviews, key=lambda x: x.get("review_date"), reverse=True)


@pytest.mark.reviews
def test_query_book_reviews_with_oldest_date_should_return_asc_date(test_client: TestClient, db_session, seed_reviews):
    query = ReviewQuery(sort_option=ReviewSortOption.OLDEST_DATE)
    book = db_session.exec(select(Book)).first()
    book_reviews = book.reviews
    assert book_reviews != None and book_reviews != []
    response = test_client.get(route_path(
        book.id), params=get_query_params(query))
    assert response.status_code == status.HTTP_200_OK
    reviews = get_res_detail(response)["items"]
    assert len(reviews) != 0
    assert reviews == sorted(
        reviews, key=lambda x: x.get("review_date"))


@pytest.mark.reviews
def test_add_book_review_should_return_review(test_client: TestClient, db_session, seed_add_review):
    book = seed_add_review
    assert book != None
    assert len(book.reviews) == 0
    body = {
        "review_title": "test",
        "review_details": "test details",
        "rating_star": 2,
    }
    response = test_client.post(route_path(book.id),json=body)
    assert response.status_code == status.HTTP_201_CREATED
    book = db_session.exec(select(Book).where(Book.id == book.id)).first()
    assert len(book.reviews) == 1