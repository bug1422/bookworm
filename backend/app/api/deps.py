from fastapi import Depends, Request, HTTPException, status
from app.core.db import Session, get_session
from app.core.security import decode_access_token, InvalidTokenError
from app.models.token import TokenData
from app.repository.user import UserRepository
from app.repository.book import BookRepository

from app.services.user import UserService
from app.services.book import BookService

def get_book_repo(session: Session = Depends(get_session)):
    return BookRepository(session)

def get_user_repo(session: Session = Depends(get_session)):
    return UserRepository(session)


def get_user_service(user_repo: UserRepository = Depends(get_user_repo)):
    return UserService(user_repo)

def get_book_service(book_repo: BookRepository = Depends(get_book_repo)):
    return BookService(book_repo)

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
