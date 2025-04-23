import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, create_engine, Session
from app.core.config import TestSettings
from app.main import app as  main_app
from app.api.deps import get_session
import app.models
settings = TestSettings()
engine = create_engine(str(settings.SQLMODEL_DATABASE_URI), echo=True)

SQLModel.metadata.create_all(engine)

@pytest.fixture(scope="session")
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = Session(connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="session")
def test_client(db_session):
    def override_get_session():
        yield db_session
    main_app.dependency_overrides[get_session] = override_get_session
    with TestClient(main_app,base_url=f"{settings.TEST_API_URL}{settings.API_V1_STR}") as test_client:
        yield test_client
