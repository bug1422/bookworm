from fastapi.testclient import TestClient
from fastapi import status

def GET_should_return_books(test_client: TestClient):
    response = test_client.get("/")
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["message"] is not None     
    