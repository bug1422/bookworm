from fastapi import APIRouter, Depends, Header, status, HTTPException
from app.api.deps import get_book_service
from app.services.book import BookService
from app.dtos.response import AppResponse
from app.dtos.book import OnSaleBookDTO
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
        detail = [OnSaleBookDTO.from_orm(book) for book in book_res.result]
    )
    
# return AppResponse[Any](
#     status_code=status.HTTP_200_OK,
#     detail= data,
#     message="success"
# )
