from sqlmodel import Session, create_engine

import app.models
from app.core.config import settings

engine = create_engine(str(settings.SQLMODEL_DATABASE_URI))


def init_db(session: Session) -> None:
    pass


def get_session():
    with Session(engine) as session:
        yield session
