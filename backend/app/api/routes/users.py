from fastapi import APIRouter, Depends, HTTPException, status
from app.schemas.user import UserDTO
from app.services.user import UserService
from app.api.deps import get_user_service
from app.api.token import get_token_data,TokenData

router = APIRouter(
    prefix="/user",
    tags=["user"],
    dependencies=[]
)




@router.get("/me", response_model=UserDTO)
async def get_user_info(
    token_data: TokenData = Depends(get_token_data),
    service: UserService = Depends(get_user_service)
):
    user = await service.get_by_id(token_data.id)
    if user:
        return UserDTO.from_sqlmodel(user)
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No user found"
        )
