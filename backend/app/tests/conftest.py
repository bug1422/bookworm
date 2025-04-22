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


@pytest.fixture(scope="function")
def db_session():
    connection = engine.connect()
    transaction = connection.begin()
    session = Session(connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture(scope="function")
def test_client(db_session):
    def override_get_session():
        with Session(engine) as session:
            yield session
        session.close_all()
    main_app.dependency_overrides[get_session] = override_get_session
    with TestClient(main_app,base_url=f"http://127.0.0.1:8000/{settings.API_V1_STR}") as test_client:
        yield test_client
