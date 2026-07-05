from __future__ import annotations

from fastapi import APIRouter, Depends, status

from app.api.dependencies import get_profile_service
from app.schemas.analysis import ProfileResponse, ProfileUpdateRequest
from app.services.profile_service import ProfileService


router = APIRouter(tags=["profile"])


@router.get("/profile", response_model=ProfileResponse, status_code=status.HTTP_200_OK)
def get_profile(profile_service: ProfileService = Depends(get_profile_service)) -> ProfileResponse:
    return profile_service.get_profile()


@router.patch("/profile", response_model=ProfileResponse, status_code=status.HTTP_200_OK)
def update_profile(
    payload: ProfileUpdateRequest,
    profile_service: ProfileService = Depends(get_profile_service),
) -> ProfileResponse:
    return profile_service.update_profile(payload)