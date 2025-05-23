from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_money_option_service, get_search_option_service
from app.models.money import MoneyOptions
from app.models.response import AppResponse
from app.models.search_option import SearchOptions
from app.services.money_option import MoneyOptionSerivce
from app.services.search_option import SearchOptionSerivce

router = APIRouter(prefix="/options", tags=["options"])
@router.options("/money", response_model=AppResponse[MoneyOptions], status_code=status.HTTP_200_OK)
async def get_money_options(
    service: MoneyOptionSerivce = Depends(get_money_option_service),
):
    option_res = service.get_money_options()
    if not option_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(option_res.exception),
        )
    return AppResponse(
        status_code=status.HTTP_200_OK, detail=option_res.result
    )


@router.options("/search", response_model=AppResponse[SearchOptions], status_code=status.HTTP_200_OK)
async def get_search_options(
    service: SearchOptionSerivce = Depends(get_search_option_service),
):
    option_res = service.get_search_options()
    if not option_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(option_res.exception),
        )
    return AppResponse(
        status_code=status.HTTP_200_OK, detail=option_res.result
    )
