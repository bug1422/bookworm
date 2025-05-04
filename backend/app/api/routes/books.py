from fastapi import APIRouter, Depends, Query, Body, status, HTTPException
from app.api.deps import get_book_service, get_review_service
from app.services.book import BookService
from app.services.review import ReviewService
from app.models.response import AppResponse
from app.models.paging import PagingResponse
from app.models.book import BookQuery, BookSearchOutput, BookDetailOutput
from app.models.review import ReviewQuery,ReviewInput, ReviewDetail
from app.models.exception import NotFoundException

router = APIRouter(prefix="/books", tags=["book"])


@router.get("/", response_model=AppResponse[PagingResponse[BookSearchOutput]], status_code=status.HTTP_200_OK)
async def get_books(
    query: BookQuery = Query(...),
    service: BookService = Depends(get_book_service),
):
    book_res = service.get_books(query)
    if not book_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(book_res.exception),
        )
    return AppResponse(detail=book_res.result)

@router.get("/on-sale", response_model=AppResponse[list[BookSearchOutput]], status_code=status.HTTP_200_OK)
async def get_on_sale_books(
    take: int = 10, service: BookService = Depends(get_book_service)
):
    book_res = service.get_top_on_sale(take)
    if not book_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(book_res.exception),
        )
    return AppResponse(detail=book_res.result)


@router.get("/featured/recommended", response_model=AppResponse[list[BookSearchOutput]], status_code=status.HTTP_200_OK)
async def get_recommended_books(
    take: int = 8, service: BookService = Depends(get_book_service)
):
    book_res = service.get_recommended_books(take)
    if not book_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(book_res.exception),
        )
    return AppResponse(detail=book_res.result)


@router.get("/featured/popular", response_model=AppResponse[list[BookSearchOutput]], status_code=status.HTTP_200_OK)
async def get_popular_books(
    take: int = 8, service: BookService = Depends(get_book_service)
):
    book_res = service.get_popular_books(take)
    if not book_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(book_res.exception),
        )
    return AppResponse(detail=book_res.result)


@router.get("/{book_id}", response_model=AppResponse[BookDetailOutput], status_code=status.HTTP_200_OK)
async def get_book_detail(
    book_id: int,
    book_service: BookService = Depends(get_book_service),
    review_service: ReviewService = Depends(get_review_service),
):
    book_res = book_service.get_book_detail(book_id, review_service)
    if not book_res.is_success:
        if isinstance(book_res.exception,NotFoundException):
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=str(book_res.exception),
            )
        else:
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(book_res.exception),
            )
    return AppResponse(detail=book_res.result)


@router.get("/{book_id}/reviews", response_model=AppResponse[PagingResponse[ReviewDetail]], status_code=status.HTTP_200_OK)
async def get_book_review(
    book_id: int,
    query: ReviewQuery = Query(...),
    service: ReviewService = Depends(get_review_service),
):
    reviews_res = service.get_book_reviews(book_id, query)
    if not reviews_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(reviews_res.exception),
        )
    return AppResponse(
        detail=reviews_res.result
    )

@router.post("/{book_id}/reviews", response_model=AppResponse, status_code=status.HTTP_201_CREATED)
async def add_review(
    book_id: int,
    body: ReviewInput = Body(...),
    review_service: ReviewService = Depends(get_review_service),
    book_service: BookService = Depends(get_book_service),
):
    add_res = review_service.add_review(book_id,body,book_service)
    if not add_res.is_success:
        raise HTTPException(status_code=status, detail=add_res.exception)
    return AppResponse(
        message="Review added",
    )
