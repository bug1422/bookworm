from fastapi import Depends, Request, HTTPException, status
from app.core.db import Session, get_session
from app.core.security import decode_access_token, InvalidTokenError
from app.models.token import TokenData


def get_user_service(session: Session = Depends(get_session)):
    from app.services.user import UserService
    return UserService(session)

def get_book_service(session: Session = Depends(get_session)):
    from app.services.book import BookService
    return BookService(session)

def get_token_data(request: Request) -> TokenData:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid credential",
        headers={"WWW-Authenticate": "Bearer"}
    )
    try:
        token = request.cookies.get("access_token")
        payload = decode_access_token(token)
        sub = payload.get("sub")
        if sub is None:
            raise credentials_exception
        token_data = TokenData(**payload)
        return token_data
    except InvalidTokenError:
        raise credentials_exception
