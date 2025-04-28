from fastapi.testclient import TestClient
from fastapi import status
import pytest
from app.models.book import BookQuery, BookSortOption, BookSearchOutput
from app.models.paging import PagingResponse
from app.models.response import AppResponse
from app.tests.test_seed_data import *
from app.tests.common import *
import sys
route_path = "/books"


def get_query_params(query: BookQuery):
    params = {
        "page": query.page,
        "take": query.take,
        "sort_option": query.sort_option.value,
    }
    if query.author_name:
        params.update({"author_name": query.author_name, })
    if query.category_name:
        params.update({"category_name": query.category_name, })
    if query.rating_star:
        params.update({"rating_star": query.rating_star, })
    return params

@pytest.mark.books
def test_query_on_sale_should_return_desc_discount_offset(test_client: TestClient, seed_discounts):
    response = test_client.get(f"{route_path}/on-sale")
    assert response.status_code == status.HTTP_200_OK
    books = get_res_detail(response)
    assert len(books) != 0
    items = [book.get("discount_offset")
             for book in books]
    assert items == sorted(items, key=lambda x: float(x), reverse=True)


@pytest.mark.books
def test_query_book_with_on_sale_should_return_desc_discount_offset(test_client: TestClient, seed_discounts, seed_reviews):
    query = BookQuery(sort_option=BookSortOption.ON_SALE)
    response = test_client.get(f"{route_path}", params=get_query_params(query))
    assert response.status_code == status.HTTP_200_OK
    books = get_res_detail(response)["items"]
    assert len(books) != 0
    items = [(book.get("discount_offset"), book.get("final_price"))
             for book in books]
    assert items == sorted(items, key=lambda x: (-float(x[0]), float(x[1])))


@pytest.mark.books
def test_query_book_with_popularity_should_return_desc_total_review(test_client: TestClient, seed_discounts, seed_reviews):
    query = BookQuery(sort_option=BookSortOption.POPULARITY)
    response = test_client.get(f"{route_path}", params=get_query_params(query))
    assert response.status_code == status.HTTP_200_OK
    books: list[BookSearchOutput] = get_res_detail(response)["items"]
    assert len(books) != 0
    items = [(book.get("total_review"), book.get("final_price"))
             for book in books]
    assert items == sorted(items, key=lambda x: (-x[0] if x[0] != None else sys.maxsize, float(x[1])))


@pytest.mark.books
def test_query_book_with_desc_price_should_return_desc_price(test_client: TestClient, seed_discounts, seed_reviews):
    query = BookQuery(sort_option=BookSortOption.PRICE_HIGH_TO_LOW)
    response = test_client.get(f"{route_path}", params=get_query_params(query))
    assert response.status_code == status.HTTP_200_OK
    books = get_res_detail(response)["items"]
    assert len(books) != 0
    items = [book.get("final_price") for book in books]
    assert items == sorted(items, key=lambda x: -float(x))


@pytest.mark.books
def test_query_book_with_asc_price_should_return_asc_price(test_client: TestClient, seed_discounts, seed_reviews):
    query = BookQuery(sort_option=BookSortOption.PRICE_LOW_TO_HGIH)
    response = test_client.get(f"{route_path}", params=get_query_params(query))
    assert response.status_code == status.HTTP_200_OK
    books = get_res_detail(response)["items"]
    assert len(books) != 0
    items = [book.get("final_price") for book in books]
    assert items == sorted(items, key=lambda x: float(x))
