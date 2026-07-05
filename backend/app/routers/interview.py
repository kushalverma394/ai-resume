from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.api.dependencies import get_analysis_service
from app.core.config import get_settings
from app.schemas.analysis import ErrorResponse, InterviewResponse
from app.schemas.resume import ExtractedResume
from app.services.resume_analysis_service import ResumeAnalysisService
from app.utils.file_utils import read_upload_file


router = APIRouter(tags=["interview"])


@router.post(
    "/interview",
    response_model=InterviewResponse,
    status_code=status.HTTP_200_OK,
    responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}, 413: {"model": ErrorResponse}},
)
async def interview(
    job_description: str | None = Form(default=None),
    role_title: str | None = Form(default=None),
    upload_id: str | None = Form(default=None),
    file: UploadFile | None = File(default=None),
    analysis_service: ResumeAnalysisService = Depends(get_analysis_service),
) -> InterviewResponse:
    settings = get_settings()

    if file is None and not upload_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Provide either a file or upload_id.")

    if file is not None:
        data, size_bytes = await read_upload_file(file, settings.max_upload_size_mb * 1024 * 1024)
        extracted = analysis_service.text_extractor.extract(
            file.filename or "resume",
            file.content_type or "application/octet-stream",
            data,
            size_bytes,
        )
    else:
        upload = analysis_service.store.get_upload(upload_id or "")
        if not upload:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Upload not found.")
        extracted = ExtractedResume(
            filename=upload.filename,
            content_type=upload.content_type,
            size_bytes=upload.size_bytes,
            text=upload.text,
            text_preview=upload.text_preview,
        )

    return analysis_service.build_interview_pack(extracted, job_description, role_title)