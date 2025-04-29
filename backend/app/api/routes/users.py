from fastapi import APIRouter, Depends, HTTPException, status, Response, Form
from app.models.response import AppResponse
from app.models.user import UserLogin, UserSignup
from app.models.token import TokenData
from app.services.user import UserService
from app.api.deps import get_user_service, get_access_token_data, get_refresh_token_data
from app.core.config import settings
from datetime import timedelta
from app.core.security import create_token

router = APIRouter(prefix="/users", tags=["user"], dependencies=[])


@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(
    response: Response,
    form_data: UserSignup = Form(),
    service: UserService = Depends(get_user_service),
):
    user_res = await service.create_account(
        form_data.first_name,
        form_data.last_name,
        form_data.is_admin,
        form_data.email,
        form_data.password,
    )
    if not user_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(user_res.exception),
        )
    create_access_token(user_res.result, response)
    create_refresh_token(user_res.result, response)
    return AppResponse(
        message="User created"
    )

@router.post("/login", status_code=status.HTTP_200_OK)
async def login(
    response: Response,
    form_data: UserLogin = Form(),
    service: UserService = Depends(get_user_service),
):
    user_res = await service.get_by_email_and_password(
        form_data.email, form_data.password
    )
    if not user_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(user_res.exception),
        )
    create_access_token(user_res.result, response)
    create_refresh_token(user_res.result, response)
    return AppResponse(
        message="User autheticated"
    )


def create_access_token(user, response: Response):
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    access_token = create_token(
        f"{user.last_name} {user.first_name}",
        {"id": user.id},
        access_token_expires,
    )
    response.set_cookie(
        key="access_token",
        value=access_token,
        expires=access_token_expires,
        httponly=True,
        secure=True,
        samesite="lax",
    )

def create_refresh_token(user, response: Response):
    refresh_token_expires = timedelta(
        minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES
    )
    refresh_token = create_token(
        f"{user.last_name} {user.first_name}",
        {"id": user.id},
        refresh_token_expires,
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        expires=refresh_token_expires,
        httponly=True,
        secure=True,
        samesite="lax",
    )

@router.get("/refresh", status_code=status.HTTP_200_OK)
async def refresh_token(
        response: Response,
        refresh_token_data: TokenData = Depends(get_refresh_token_data),
        service: UserService = Depends(get_user_service)
):
    user_res = await service.get_user_info(refresh_token_data.id)
    create_access_token(user_res.result, response)
    if not user_res.is_success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No user found"
        )
    return AppResponse(
        message="User token refreshed"
    )


@router.get("/logout", response_model=AppResponse, status_code=status.HTTP_200_OK)
async def logout(
    response: Response,
):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return AppResponse(message="User logout")


@router.get("/me", response_model=AppResponse, status_code=status.HTTP_200_OK)
async def get_user_info(
    access_token_data: TokenData = Depends(get_access_token_data),
    service: UserService = Depends(get_user_service),
):
    user_res = await service.get_user_info(access_token_data.id)
    if user_res.is_success:
        return AppResponse(
            message="User Info",
            detail=user_res.result,
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="No user found"
        )
