from fastapi.testclient import TestClient
from fastapi import status
import pytest
from app.core.config import settings
from app.models.order import  OrderInput, OrderItemInput, OrderValidateOutput
from app.models.paging import PagingResponse
from app.models.response import AppResponse
from app.tests.test_seed_data import *
from app.tests.common import *
route_path = "/orders"

def get_order_body(items: list[OrderItemInput]):
    body = [
            {
                "book_id": item.book_id,
                "discount_id": item.discount_id,
                "cart_price": float(item.cart_price),
                "quantity": item.quantity
            }
            for item in items
        ]
    return body


@pytest.mark.orders
def test_validate_valid_cart_should_return_success(test_client: TestClient, get_cart_item):
    item = get_cart_item
    response = test_client.post(f"{route_path}/validate",json=get_order_body([item]))
    assert response.status_code == status.HTTP_200_OK
    data: OrderValidateOutput = get_res_detail(response)
    assert data.get("exception_details") == []
    for item in data.get("validated_items"):
        assert item.get("exception_details") == []
    
@pytest.mark.orders
def test_validate_exceed_quantity_cart_should_return_fail(test_client: TestClient, get_cart_item):
    item = get_cart_item
    item.quantity = settings.MAX_ITEM_QUANTITY + 1
    response = test_client.post(f"{route_path}/validate",json=get_order_body([item]))
    assert response.status_code == status.HTTP_200_OK
    data: OrderValidateOutput = get_res_detail(response)
    assert data.get("exception_details") == []
    for item in data.get("validated_items"):
        assert item.get("exception_details") != [] and f"Item quantity can't be larger than {settings.MAX_ITEM_QUANTITY}" in item.get("exception_details")
    
@pytest.mark.orders
def test_validate_duplicate_item_cart_should_return_fail(test_client: TestClient, get_cart_item):
    item = get_cart_item
    item.quantity = 10
    response = test_client.post(f"{route_path}/validate",json=get_order_body([item,item]))
    assert response.status_code == status.HTTP_200_OK
    data: OrderValidateOutput = get_res_detail(response)
    assert data.get("exception_details") != [] and "List can't contain duplicate id" in data.get("exception_details")
    
@pytest.mark.orders
def test_checkout_cart_returns_success(test_client: TestClient, get_cart_item, seed_user):
    auth_response = authenticate(test_client,seed_user)
    assert len(auth_response.cookies) != 0
    test_client.cookies.update()
    item = get_cart_item
    response = test_client.post(f"{route_path}",json=get_order_body([item]),cookies=auth_response.cookies)
    assert response.status_code == status.HTTP_201_CREATED
