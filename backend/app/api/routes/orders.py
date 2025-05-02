from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi import APIRouter, Depends
from app.api.deps import get_order_service, get_access_token_data
from app.services.order import OrderService
from app.models.response import AppResponse
from typing import List
from app.models.order import OrderInput, OrderItemInput, OrderValidateOutput
from app.models.token import TokenData

router = APIRouter(prefix="/orders", tags=["order"])


@router.post("/", response_model=AppResponse, status_code=status.HTTP_201_CREATED)
async def create_order(
    token_data: TokenData = Depends(get_access_token_data),
    order_input: OrderInput = Body(...),
    service: OrderService = Depends(get_order_service),
):
    validate_res = await service.add_order(order_input, user_id=token_data.id)
    if not validate_res.is_success:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                      detail=validate_res.exception)
    return AppResponse(
        message="order validated",
    )


@router.post("/validate", response_model=AppResponse[OrderValidateOutput], status_code=status.HTTP_200_OK)
async def validate_order(
    order_items: List[OrderItemInput] = Body(), service: OrderService = Depends(get_order_service)
):
    validate_res = await service.validate_order(order_items)
    if not validate_res.is_success:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                      detail=validate_res.exception)
    return AppResponse(
        message="validation complete",
        detail=validate_res.result,
    )
