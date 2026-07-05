from __future__ import annotations

from pydantic import BaseModel


class ExtractedResume(BaseModel):
    filename: str
    content_type: str
    size_bytes: int
    text: str
    text_preview: str