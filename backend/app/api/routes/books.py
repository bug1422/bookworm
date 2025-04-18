from fastapi import APIRouter, Depends, Query, status, HTTPException
from app.api.deps import get_book_service, get_review_service
from app.services.book import BookService
from app.services.review import ReviewService
from app.models.response import AppResponse
from app.models.book import BookQuery
from app.models.review import ReviewQuery
from typing import Any

router = APIRouter(prefix="/books", tags=["book"])


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


@router.get("/on-sale", response_model=AppResponse)
async def get_on_sale_books(take: int = 10, service: BookService = Depends(get_book_service)):
    book_res = await service.get_top_on_sale(take)
    if not book_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(book_res.exception),
        )
    return AppResponse(
        status_code=status.HTTP_200_OK,
        detail=book_res.result
    )

@router.get("/featured/recommended", response_model=AppResponse)
async def get_recommended_books(take: int = 8, service: BookService = Depends(get_book_service)):
    book_res = await service.get_recommended_books(take)
    if not book_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(book_res.exception),
        )
    return AppResponse(
        status_code=status.HTTP_200_OK,
        detail=book_res.result
    )
    
@router.get("/featured/popular", response_model=AppResponse)
async def get_popular_books(take: int = 8, service: BookService = Depends(get_book_service)):
    book_res = await service.get_popular_books(take)
    if not book_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(book_res.exception),
        )
    return AppResponse(
        status_code=status.HTTP_200_OK,
        detail=book_res.result
    )


@router.get("/{book_id}", response_model=AppResponse)
async def get_book_detail(
    book_id: int,
    book_service: BookService = Depends(get_book_service),
    review_service: ReviewService = Depends(get_review_service)
):
    book_res = await book_service.get_book_detail(book_id, review_service)
    if not book_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(book_res.exception)
        )
    return AppResponse(
        status_code=status.HTTP_200_OK,
        detail=book_res.result
    )



@router.get("/{book_id}", response_model=AppResponse)
async def get_book_detail(
    book_id: int,
    book_service: BookService = Depends(get_book_service),
    review_service: ReviewService = Depends(get_review_service)
):
    book_res = await book_service.get_book_detail(book_id, review_service)
    if not book_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(book_res.exception)
        )
    return AppResponse(
        status_code=status.HTTP_200_OK,
        detail=book_res.result
    )


@router.get("/{book_id}/reviews", response_model=AppResponse)
async def get_book_review(
    book_id: int,
    query: ReviewQuery = Query(...),
    service: ReviewService = Depends(get_review_service)
):
    reviews_res = await service.get_book_reviews(book_id, query)
    if not reviews_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(reviews_res.exception)
        )
    return AppResponse(
        status_code=status.HTTP_200_OK,
        detail=reviews_res.result
    )
