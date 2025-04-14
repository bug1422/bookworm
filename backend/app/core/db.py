from sqlmodel import Session, create_engine, select
from app.core.config import settings
engine = create_engine(str(settings.SQLMODEL_DATABASE_URI))

def init_db(session: Session) -> None:
    pass