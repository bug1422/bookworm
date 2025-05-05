from fastapi import APIRouter

from app.api.routes import (
    authors,
    books,
    categories,
    discounts,
    options,
    orders,
    users,
)
from app.core.config import settings

api_router = APIRouter()

api_router.include_router(authors.router)
api_router.include_router(books.router)
api_router.include_router(categories.router)
api_router.include_router(discounts.router)
api_router.include_router(orders.router)
api_router.include_router(users.router)
api_router.include_router(options.router)
