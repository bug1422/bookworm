from fastapi import APIRouter, Depends, Query, status, HTTPException
from app.api.deps import get_book_service
from app.services.book import BookService
from app.models.response import AppResponse
from app.models.book import BookQuery
from typing import Any

router = APIRouter(prefix="/book", tags=["book"])


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
        detail = book_res.result
    )

@router.get("/",response_model=AppResponse)
async def get_books(query: BookQuery = Query(...), service: BookService = Depends(get_book_service)):
    book_res = await service.get_books(query)
    if not book_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(book_res.exception)
        )
    return AppResponse(
        status_code=status.HTTP_200_OK,
        detail=book_res.result
    )