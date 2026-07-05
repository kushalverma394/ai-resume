from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, Query, status

from app.api.dependencies import get_analysis_service, get_analysis_store
from app.schemas.analysis import ErrorResponse, HistoryResponse
from app.services.resume_analysis_service import AnalysisStore, ResumeAnalysisService


router = APIRouter(tags=["history"])


@router.get("/history", response_model=HistoryResponse, status_code=status.HTTP_200_OK)
def get_history(
    limit: int = Query(default=20, ge=1, le=100),
    store: AnalysisStore = Depends(get_analysis_store),
) -> HistoryResponse:
    items = store.list_history()[:limit]
    return HistoryResponse(items=items, count=len(items))


@router.delete(
    "/history/{analysis_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={404: {"model": ErrorResponse}},
)
def delete_history_item(
    analysis_id: str,
    analysis_service: ResumeAnalysisService = Depends(get_analysis_service),
) -> None:
    deleted = analysis_service.delete_analysis(analysis_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Analysis not found.")