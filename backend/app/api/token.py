from fastapi import APIRouter, Form, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from app.services.user import UserService
from app.schemas.token import Token, TokenData
from app.core.config import settings
from app.api.deps import get_user_service
from app.core.security import create_access_token, decode_access_token, InvalidTokenError
from datetime import timedelta

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/token")
router = APIRouter(tags=["token"])


@router.post("/token")
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    service: UserService = Depends(get_user_service)
) -> Token:
    user = await service.get_by_email_and_password(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    access_token_expires = timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        f"{user.last_name} {user.first_name}", {"id": user.id}, access_token_expires)
    return Token(access_token=access_token, token_type="bearer")

credentials_exception = HTTPException(
    status_code=status.HTTP_401_UNAUTHORIZED,
    detail="Invalid credential",
    headers={"WWW-Authenticate": "Bearer"}
)


def get_token_data(
    token: str = Depends(oauth2_scheme),
) -> TokenData:
    try:
        payload = decode_access_token(token)
        sub = payload.get("sub")
        if sub is None:
            raise credentials_exception
        token_data = TokenData(**payload)
        return token_data
    except InvalidTokenError:
        raise credentials_exception
