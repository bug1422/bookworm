import pytest
from fastapi.testclient import TestClient
from fastapi import status
from app.tests.conftest import test_client, db_session
from app.models.user import User
from app.tests.test_seed_data import seed_user
from sqlmodel import Session, select


def get_res_detail(res):
    return res.json()["detail"]


def authenticate(test_client: TestClient, user: User):
    response = test_client.post(
        "/users/login", data={"email": user.email, "password": "123"})
    assert response.status_code == status.HTTP_200_OK
    return response
