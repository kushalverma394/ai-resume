from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel

from app.schemas.analysis import ResumeAnalysis


class StoredUpload(BaseModel):
    upload_id: str
    filename: str
    content_type: str
    size_bytes: int
    text: str
    text_preview: str
    created_at: datetime


class StoredAnalysis(BaseModel):
    analysis_id: str
    upload_id: str
    filename: str
    content_type: str
    size_bytes: int
    analysis: ResumeAnalysis
    created_at: datetime