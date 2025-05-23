from typing import List

from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

from app.api.deps import get_access_token_data, get_order_service
from app.models.exception import OrderValidationException
from app.models.order import OrderInput, OrderValidateOutput
from app.models.order_item import (
    OrderItemCheckoutInput,
    OrderItemValidateInput,
)
from app.models.response import AppResponse
from app.models.token import TokenData
from app.services.order import OrderService

router = APIRouter(prefix="/orders", tags=["order"])


@router.post("/", response_model=AppResponse[OrderValidateOutput | None], status_code=status.HTTP_201_CREATED)
async def create_order(
    token_data: TokenData = Depends(get_access_token_data),
    order_items: List[OrderItemCheckoutInput] = Body(...),
    service: OrderService = Depends(get_order_service),
):
    create_res = service.add_order(
        user_id=token_data.id, order_items=order_items)
    if not create_res.is_success:
        if not isinstance(create_res.exception, OrderValidationException):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail=str(create_res.exception))
        else:
            return JSONResponse(
                status_code=status.HTTP_409_CONFLICT,
                content=jsonable_encoder(AppResponse(
                    message="order revalidated",
                    detail=create_res.exception.get_order_output(),
                ))
            )
    return AppResponse(
        message="order created",
    )


@router.post("/validate", response_model=AppResponse[OrderValidateOutput], status_code=status.HTTP_200_OK)
async def validate_order(
    order_items: List[OrderItemValidateInput] = Body(), service: OrderService = Depends(get_order_service)
):
    validate_res = service.validate_order(order_items)
    if not validate_res.is_success:
        if not isinstance(validate_res.exception, OrderValidationException):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail=str(validate_res.exception))
        else:
            return JSONResponse(
                status_code=status.HTTP_409_CONFLICT,
                content=jsonable_encoder(AppResponse(
                    message="order revalidated",
                    detail=validate_res.exception.get_order_output(),
                ))
            )
    return AppResponse(
        message="order validated",
        detail=validate_res.result,
    )
