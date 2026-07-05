from __future__ import annotations

import os
from functools import lru_cache

from dotenv import load_dotenv
from pydantic import BaseModel, Field


load_dotenv()


def _parse_csv(value: str | None, default: list[str]) -> list[str]:
    if not value:
        return default
    return [item.strip() for item in value.split(",") if item.strip()]


class Settings(BaseModel):
    app_name: str = "AI Resume Analyzer API"
    api_prefix: str = "/api"
    environment: str = Field(default="development")
    max_upload_size_mb: int = Field(default=10, ge=1, le=50)
    rate_limit_per_minute: int = Field(default=120, ge=10, le=1000)
    allowed_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
        ]
    )
    gemini_api_key: str | None = None
    gemini_model: str = "gemini-1.5-flash"
    history_limit: int = Field(default=100, ge=1, le=1000)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings(
        environment=os.getenv("ENVIRONMENT", "development"),
        max_upload_size_mb=int(os.getenv("MAX_UPLOAD_SIZE_MB", "10")),
        rate_limit_per_minute=int(os.getenv("RATE_LIMIT_PER_MINUTE", "120")),
        allowed_origins=_parse_csv(
            os.getenv("ALLOWED_ORIGINS"),
            ["http://localhost:3000", "http://127.0.0.1:3000"],
        ),
        gemini_api_key=os.getenv("GEMINI_API_KEY"),
        gemini_model=os.getenv("GEMINI_MODEL", "gemini-1.5-flash"),
        history_limit=int(os.getenv("HISTORY_LIMIT", "100")),
    )