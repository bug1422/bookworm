from fastapi import APIRouter, Body, Depends, HTTPException, status
from app.api.deps import get_review_service
from app.services.review import ReviewService
from app.models.response import AppResponse
from app.models.review import ReviewInput
router = APIRouter(prefix="reviews", tags=["review"])


@router.post("/", response_model=AppResponse)
async def add_review(body: ReviewInput = Body(...), service: ReviewService = Depends(get_review_service)):
    add_res = await service.add_review(body)
    if not add_res.is_success:
        HTTPException(status_code=status, detail=add_res.exception)
    return AppResponse(status_code=status.HTTP_201_CREATED, message="review added", detail=add_res.result)
