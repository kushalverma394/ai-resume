from __future__ import annotations

from fastapi import APIRouter, Depends, Form, Response, status

from app.api.dependencies import get_analysis_service
from app.services.resume_analysis_service import ResumeAnalysisService


router = APIRouter(tags=["export"])


@router.post("/export")
def export_pdf(
    upload_id: str | None = Form(default=None),
    analysis_id: str | None = Form(default=None),
    analysis_service: ResumeAnalysisService = Depends(get_analysis_service),
) -> Response:
    pdf_bytes, filename = analysis_service.build_export_pdf(upload_id=upload_id, analysis_id=analysis_id)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
        status_code=status.HTTP_200_OK,
    )