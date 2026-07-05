from __future__ import annotations

import io
import mimetypes
from pathlib import Path

from fastapi import HTTPException, UploadFile, status


PDF_MIME_TYPES = {"application/pdf"}
DOCX_MIME_TYPES = {
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
}
ALLOWED_EXTENSIONS = {".pdf", ".docx"}


def infer_mime_type(filename: str) -> str:
    guessed_type, _ = mimetypes.guess_type(filename)
    return guessed_type or "application/octet-stream"


async def read_upload_file(upload_file: UploadFile, max_size_bytes: int) -> tuple[bytes, int]:
    data = await upload_file.read()
    size_bytes = len(data)
    if size_bytes == 0:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Uploaded file is empty.")
    if size_bytes > max_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File size exceeds the maximum allowed limit of {max_size_bytes // (1024 * 1024)} MB.",
        )
    return data, size_bytes


def validate_resume_file(filename: str, content_type: str) -> None:
    extension = Path(filename).suffix.lower()
    normalized_content_type = (content_type or "").lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF and DOCX files are supported.",
        )

    if extension == ".pdf" and normalized_content_type not in PDF_MIME_TYPES:
        if normalized_content_type not in {"application/octet-stream", ""}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded file does not appear to be a valid PDF.",
            )

    if extension == ".docx" and normalized_content_type not in DOCX_MIME_TYPES:
        if normalized_content_type not in {"application/octet-stream", ""}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="The uploaded file does not appear to be a valid DOCX document.",
            )


def preview_text(text: str, limit: int = 240) -> str:
    normalized = " ".join(text.split())
    return normalized[:limit]


def make_bytes_io(data: bytes) -> io.BytesIO:
    return io.BytesIO(data)