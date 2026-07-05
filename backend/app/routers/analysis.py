from __future__ import annotations

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.api.dependencies import get_analysis_service
from app.core.config import get_settings
from app.schemas.analysis import ErrorResponse, ResumeAnalysis
from app.services.resume_analysis_service import ResumeAnalysisService
from app.utils.file_utils import read_upload_file


router = APIRouter(tags=["analysis"])


@router.post(
    "/analyze",
    response_model=ResumeAnalysis,
    status_code=status.HTTP_200_OK,
    responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}, 413: {"model": ErrorResponse}},
)
async def analyze_resume(
    upload_id: str | None = Form(default=None),
    job_description: str | None = Form(default=None),
    file: UploadFile | None = File(default=None),
    analysis_service: ResumeAnalysisService = Depends(get_analysis_service),
) -> ResumeAnalysis:
    settings = get_settings()

    if file is None and not upload_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Provide either a file or an upload_id for analysis.",
        )

    if file is not None:
        data, size_bytes = await read_upload_file(file, settings.max_upload_size_mb * 1024 * 1024)
        return analysis_service.analyze_uploaded_file(
            file.filename or "resume",
            file.content_type or "application/octet-stream",
            data,
            size_bytes,
            job_description=job_description,
        )

    return analysis_service.analyze_upload_id(upload_id=upload_id or "", job_description=job_description)