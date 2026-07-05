from __future__ import annotations

from fastapi import APIRouter, Depends, File, UploadFile, status

from app.api.dependencies import get_analysis_service
from app.core.config import get_settings
from app.schemas.analysis import ErrorResponse, UploadResponse
from app.services.resume_analysis_service import ResumeAnalysisService
from app.utils.file_utils import read_upload_file


router = APIRouter(tags=["upload"])


@router.post(
    "/upload",
    response_model=UploadResponse,
    status_code=status.HTTP_201_CREATED,
    responses={400: {"model": ErrorResponse}, 413: {"model": ErrorResponse}},
)
async def upload_resume(
    file: UploadFile = File(...),
    analysis_service: ResumeAnalysisService = Depends(get_analysis_service),
) -> UploadResponse:
    settings = get_settings()
    data, size_bytes = await read_upload_file(file, settings.max_upload_size_mb * 1024 * 1024)
    upload = analysis_service.upload_resume(file.filename or "resume", file.content_type or "application/octet-stream", data, size_bytes)
    return UploadResponse(
        upload_id=upload.upload_id,
        filename=upload.filename,
        content_type=upload.content_type,
        size_bytes=upload.size_bytes,
        text_length=len(upload.text),
        text_preview=upload.text_preview,
    )