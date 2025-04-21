from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi import APIRouter, Depends
from app.api.deps import get_order_service, get_token_data
from app.services.order import OrderService
from app.models.response import AppResponse
from app.models.order import OrderInput
from app.models.token import TokenData
router = APIRouter(tags=["order"])


@router.get("/validate", response_model=AppResponse)
async def validate_order(order_input: OrderInput, service: OrderService = Depends(get_order_service)):
    validate_res = await service.validate_order(order_input)
    if not validate_res.is_success:
        HTTPException(status_code=status, detail=validate_res.exception)
    return AppResponse(status_code=status.HTTP_200_OK, message="order validated", detail=validate_res.result)

@router.post("/", response_model=AppResponse)
async def validate_order(token_data: TokenData = Depends(get_token_data), order_input: OrderInput = Body(...), service: OrderService = Depends(get_order_service)):
    validate_res = await service.add_order(order_input,user_id=token_data.id)
    if not validate_res.is_success:
        HTTPException(status_code=status, detail=validate_res.exception)
    return AppResponse(status_code=status.HTTP_200_OK, message="order validated", detail=validate_res.result)
