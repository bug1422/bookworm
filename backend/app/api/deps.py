from fastapi import Depends, Request, HTTPException, status
from app.core.db import Session, get_session
from app.core.security import decode_access_token, InvalidTokenError
from app.models.token import TokenData
from app.repository.user import UserRepository
from app.repository.book import BookRepository
from app.repository.review import ReviewRepository
from app.repository.author import AuthorRepository
from app.repository.category import CategoryRepository

from app.services.user import UserService
from app.services.book import BookService
from app.services.review import ReviewService
from app.services.author import AuthorService
from app.services.category import CategoryService
from app.services.search_option import SearchOptionSerivce


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

# region Service&Repository


def __get_book_repo(session: Session = Depends(get_session)):
    return BookRepository(session)


def __get_user_repo(session: Session = Depends(get_session)):
    return UserRepository(session)


def __get_review_repo(session: Session = Depends(get_session)):
    return ReviewRepository(session)


def __get_author_repo(session: Session = Depends(get_session)):
    return AuthorRepository(session)


def __get_category_repo(session: Session = Depends(get_session)):
    return CategoryRepository(session)


def get_user_service(user_repo: UserRepository = Depends(__get_user_repo)):
    return UserService(user_repo)


def get_book_service(book_repo: BookRepository = Depends(__get_book_repo)):
    return BookService(book_repo)


def get_review_service(review_repo: ReviewRepository = Depends(__get_review_repo)):
    return ReviewService(review_repo)


def get_author_service(author_repo: AuthorRepository = Depends(__get_author_repo)):
    return AuthorService(author_repo)


def get_category_service(category_repo: CategoryRepository = Depends(__get_category_repo)):
    return CategoryService(category_repo)


def get_search_option_service(
    book_service: BookService = Depends(get_book_service),
    author_service: AuthorService = Depends(get_author_service),
    category_service: CategoryService = Depends(get_category_service),
    review_service: ReviewService = Depends(get_review_service)
):
    return SearchOptionSerivce(book_service,author_service,category_service,review_service)
# endregion
