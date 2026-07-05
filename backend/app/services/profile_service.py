from __future__ import annotations

from pydantic import BaseModel

from app.schemas.analysis import ProfileResponse, ProfileUpdateRequest


class ProfileState(BaseModel):
    full_name: str = "Kushal Verma"
    email: str = "kushal@resumepro.app"
    headline: str = "Product designer focused on AI-assisted hiring workflows"
    bio: str = (
        "I build elegant interfaces, decision-support tools, and product systems that help people move faster."
    )
    plan: str = "Pro"
    theme: str = "Dark"
    email_notifications: bool = True
    push_notifications: bool = False
    oauth_connected: list[str] = ["Google", "GitHub"]


class ProfileService:
    def __init__(self) -> None:
        self._profile = ProfileState()

    def get_profile(self) -> ProfileResponse:
        return ProfileResponse.model_validate(self._profile.model_dump())

    def update_profile(self, payload: ProfileUpdateRequest) -> ProfileResponse:
        updates = payload.model_dump(exclude_unset=True)
        for key, value in updates.items():
            setattr(self._profile, key, value)
        return self.get_profile()