from fastapi import APIRouter, Depends, HTTPException, status, Response, Form
from app.dtos.response import AppResponse
from app.dtos.user import UserDTO, UserLoginDTO
from app.dtos.token import TokenData
from app.services.user import UserService
from app.api.deps import get_user_service, get_token_data
from app.core.config import settings
from datetime import timedelta
from app.core.security import create_access_token

router = APIRouter(
    prefix="/user",
    tags=["user"],
    dependencies=[]
)


@router.post("/login", status_code=status.HTTP_200_OK)
async def login(
    response: Response,
    form_data: UserLoginDTO = Form(),
    service: UserService = Depends(get_user_service)
):
    user_res = await service.get_by_email_and_password(form_data.email, form_data.password)
    if not user_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail=str(user.exception))
    user = user_res.result            
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        f"{user.last_name} {user.first_name}", {"id": user.id}, access_token_expires)
    response.set_cookie(
        key="access_token",
        value=access_token,
        expires=access_token_expires,
        httponly=True,
        secure=True,
        samesite="lax"
    )
    return AppResponse(status_code=status.HTTP_200_OK, message="Authentication success")


@router.get("/logout", response_model=AppResponse)
async def logout(
    response: Response,
):
    response.delete_cookie("access_token")
    return AppResponse(status_code=status.HTTP_200_OK, message="")


@router.get("/me", response_model=AppResponse)
async def get_user_info(
    token_data: TokenData = Depends(get_token_data),
    service: UserService = Depends(get_user_service)
):
    user_res = await service.get_by_id(token_data.id)
    if user_res.is_success:
        return AppResponse(status_code=status.HTTP_200_OK,message="User Info",detail=UserDTO.from_sqlmodel(user_res.result))
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user found"
        )
