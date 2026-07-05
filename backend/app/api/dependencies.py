from __future__ import annotations

from fastapi import Request

from app.core.config import get_settings
from app.services.resume_analysis_service import AnalysisStore, ResumeAnalysisService
from app.services.profile_service import ProfileService
from app.services.text_extraction_service import TextExtractionService


def _ensure_services(request: Request) -> tuple[AnalysisStore, ResumeAnalysisService]:
    if not hasattr(request.app.state, "analysis_store") or not hasattr(request.app.state, "analysis_service"):
        settings = get_settings()
        request.app.state.analysis_store = AnalysisStore(history_limit=settings.history_limit)
        request.app.state.analysis_service = ResumeAnalysisService(
            settings=settings,
            store=request.app.state.analysis_store,
            text_extractor=TextExtractionService(),
        )

    return request.app.state.analysis_store, request.app.state.analysis_service


def get_analysis_service(request: Request) -> ResumeAnalysisService:
    _, analysis_service = _ensure_services(request)
    return analysis_service


def get_analysis_store(request: Request) -> AnalysisStore:
    analysis_store, _ = _ensure_services(request)
    return analysis_store


def _ensure_profile_service(request: Request) -> ProfileService:
    if not hasattr(request.app.state, "profile_service"):
        request.app.state.profile_service = ProfileService()
    return request.app.state.profile_service


def get_profile_service(request: Request) -> ProfileService:
    return _ensure_profile_service(request)