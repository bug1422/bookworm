from app.services.base import BaseService
from app.repository.review import ReviewRepository
from app.models.review import Review, ReviewBase
from sqlmodel import Session
from typing import Tuple

class ReviewService(BaseService[ReviewRepository]):
    def __init__(self, review_repo: ReviewRepository):
        super().__init__(review_repo)
