from datetime import datetime, timezone

from fastapi import Depends, HTTPException, Request, status

from app.core.db import Session, get_session
from app.core.security import InvalidTokenError, decode_token
from app.models.token import TokenData
from app.repository.author import AuthorRepository
from app.repository.book import BookRepository
from app.repository.category import CategoryRepository
from app.repository.discount import DiscountRepository
from app.repository.order import OrderRepository
from app.repository.order_item import OrderItemRepository
from app.repository.review import ReviewRepository
from app.repository.user import UserRepository
from app.services.author import AuthorService
from app.services.book import BookService
from app.services.category import CategoryService
from app.services.discount import DiscountService
from app.services.money_option import MoneyOptionSerivce
from app.services.order import OrderService
from app.services.order_item import OrderItemService
from app.services.review import ReviewService
from app.services.search_option import SearchOptionSerivce
from app.services.user import UserService


def credentials_exception(detail=""):
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=detail,
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_refresh_token_data(request: Request):
    try:
        refresh_token = request.cookies.get("refresh_token")
        payload = decode_token(refresh_token)
        sub = payload.get("sub")
        if sub is None:
            raise credentials_exception("Invalid credential")
        exp_timestamp = payload.get("exp")
        expiration_time = datetime.fromtimestamp(
            timestamp=exp_timestamp, tz=timezone.utc)
        if expiration_time < datetime.now(timezone.utc):
            raise credentials_exception("Expired credential")
        token_data = TokenData(**payload)
        return token_data
    except InvalidTokenError:
        raise credentials_exception("Invalid credential")


def get_access_token_data(request: Request) -> TokenData:
    try:
        token = request.cookies.get("access_token")
        payload = decode_token(token)
        sub = payload.get("sub")
        if sub is None:
            raise credentials_exception("Invalid credential")
        exp_timestamp = payload.get("exp")
        expiration_time = datetime.fromtimestamp(
            timestamp=exp_timestamp, tz=timezone.utc)
        if expiration_time < datetime.now(timezone.utc):
            raise credentials_exception("Expired credential")
        token_data = TokenData(**payload)
        return token_data
    except InvalidTokenError:
        raise credentials_exception("Invalid credential")


# region Repository


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


def __get_order_repo(session: Session = Depends(get_session)):
    return OrderRepository(session)


def __get_discount_repo(session: Session = Depends(get_session)):
    return DiscountRepository(session)


def __get_order_repo(session: Session = Depends(get_session)):
    return OrderRepository(session)


def __get_order_item_repo(session: Session = Depends(get_session)):
    return OrderItemRepository(session)


# endregion
# region Service


def get_user_service(user_repo: UserRepository = Depends(__get_user_repo)):
    return UserService(user_repo)


def get_book_service(book_repo: BookRepository = Depends(__get_book_repo)):
    return BookService(book_repo)


def get_review_service(
    review_repo: ReviewRepository = Depends(__get_review_repo),
):
    return ReviewService(review_repo)


def get_author_service(
    author_repo: AuthorRepository = Depends(__get_author_repo),
):
    return AuthorService(author_repo)


def get_category_service(
    category_repo: CategoryRepository = Depends(__get_category_repo),
):
    return CategoryService(category_repo)


def get_discount_service(
    discount_repo: DiscountRepository = Depends(__get_discount_repo),
):
    return DiscountService(discount_repo)


def get_order_item_service(
    order_item_repo: OrderItemRepository = Depends(__get_order_item_repo),
    book_service: BookService = Depends(get_book_service),
    discount_service: DiscountService = Depends(get_discount_service),
):
    return OrderItemService(
        item_repository=order_item_repo,
        book_service=book_service,
        discount_service=discount_service,
    )


def get_order_service(
    order_repository: OrderRepository = Depends(__get_order_repo),
    user_service: UserService = Depends(get_user_service),
    item_service: OrderItemService = Depends(get_order_item_service),
):
    return OrderService(
        order_repository=order_repository,
        item_service=item_service,
        user_service=user_service
    )


def get_search_option_service(
    book_service: BookService = Depends(get_book_service),
    author_service: AuthorService = Depends(get_author_service),
    category_service: CategoryService = Depends(get_category_service),
    review_service: ReviewService = Depends(get_review_service),
):
    return SearchOptionSerivce(
        book_service, author_service, category_service, review_service
    )

def get_money_option_service():
    return MoneyOptionSerivce()

# endregion
