from fastapi import Depends
from app.core.db import Session, get_session



def get_user_service(session: Session = Depends(get_session)):
    from app.services.user import UserService
    return UserService(session) 