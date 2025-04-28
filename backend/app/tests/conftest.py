import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from app.core.config import TestSettings
from app.main import app as main_app
from app.api.deps import get_session
import os
import app.models


def pytest_configure(config):
    config.addinivalue_line("markers", "books: all book endpoint tests")
    config.addinivalue_line("markers", "reviews: all review endpoint tests")


settings = TestSettings()
engine = create_engine(str(settings.SQLMODEL_DATABASE_URI), echo=True)

SQLModel.metadata.drop_all(engine)
SQLModel.metadata.create_all(engine)


@pytest.fixture(scope="session")
def db_session():
    try:
        connection = engine.connect()
        session = Session(connection)
        yield session
    except Exception as e:
        print(f"Error during setup or teardown: {e}")
    finally:
        session.close()
        connection.close()

@pytest.fixture(scope="session")
def test_client(db_session):
    def override_get_session():
        yield db_session
    main_app.dependency_overrides[get_session] = override_get_session
    with TestClient(main_app,base_url=f"{settings.TEST_API_URL}{settings.API_V1_STR}") as test_client:
        yield test_client
