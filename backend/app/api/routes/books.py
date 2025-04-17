from fastapi import APIRouter, Depends, Query, status, HTTPException
from app.api.deps import get_book_service, get_author_service, get_category_service, get_review_service
from app.services.book import BookService
from app.services.author import AuthorService
from app.services.category import CategoryService
from app.models.response import AppResponse
from app.models.book import BookQuery
from typing import Any

router = APIRouter(prefix="/books", tags=["book"])


@router.get("/on-sale", response_model=AppResponse)
async def get_on_sale_books(limit: int = 10, service: BookService = Depends(get_book_service)):
    book_res = await service.get_top_on_sale(limit)
    if not book_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(book_res.exception),
        )
    return AppResponse(
        status_code=status.HTTP_200_OK,
        detail=book_res.result
    )


@router.get("/", response_model=AppResponse)
async def get_books(query: BookQuery = Query(...), service: BookService = Depends(get_book_service)):
    book_res = await service.get_books(query)
    if not book_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(book_res.exception)
        )
    return AppResponse(
        status_code=status.HTTP_200_OK,
        detail=book_res.result
    )


@router.get("/", response_model=AppResponse)
async def get_book_detail(book_id: int = Query(...), service: BookService = Depends(get_book_service)):
    book_res = await service.get_book_detail(book_id)
    if not book_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(book_res.exception)
        )
    return AppResponse(
        status_code=status.HTTP_200_OK,
        detail=book_res.result
    )


@router.get("/search-option", response_model=AppResponse)
async def get_search_options(
    book_service: BookService = Depends(get_book_service),
    author_service: AuthorService = Depends(get_author_service),
    category_service: CategoryService = Depends(get_category_service),
):
    option_res = await book_service.get_book_search_option(author_service,category_service)
    if not option_res.is_success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=str(option_res.exception)
            )
    return AppResponse(
        status_code=status.HTTP_200_OK,
        detail=option_res.result
    )
