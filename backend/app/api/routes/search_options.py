from fastapi import APIRouter, Depends, status, HTTPException
from app.models.response import AppResponse
from app.services.search_option import SearchOptionSerivce
from app.api.deps import get_search_option_service
router = APIRouter(prefix="/search-option", tags=["review"])


@router.options("/", response_model=AppResponse)
async def get_book_search_options(
    service: SearchOptionSerivce = Depends(get_search_option_service)
):
    option_res = await service.get_search_options()
    if not option_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(option_res.exception)
        )
    return AppResponse(
        status_code=status.HTTP_200_OK,
        detail=option_res.result
    )
