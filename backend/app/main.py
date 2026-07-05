from __future__ import annotations

import time
from contextlib import asynccontextmanager
from collections import defaultdict, deque

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.core.logging import configure_logging, logger
from app.routers.analysis import router as analysis_router
from app.routers.cover_letter import router as cover_letter_router
from app.routers.health import router as health_router
from app.routers.auth import router as auth_router
from app.routers.history import router as history_router
from app.routers.interview import router as interview_router
from app.routers.job_match import router as job_match_router
from app.routers.profile import router as profile_router
from app.routers.export import router as export_router
from app.routers.upload import router as upload_router
from app.services.resume_analysis_service import AnalysisStore, ResumeAnalysisService
from app.services.profile_service import ProfileService
from app.services.text_extraction_service import TextExtractionService


configure_logging()
settings = get_settings()
rate_limit_window = 60.0
request_buckets: dict[str, deque[float]] = defaultdict(deque)


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.analysis_store = AnalysisStore(history_limit=settings.history_limit)
    app.state.analysis_service = ResumeAnalysisService(
        settings=settings,
        store=app.state.analysis_store,
        text_extractor=TextExtractionService(),
    )
    app.state.profile_service = ProfileService()
    logger.info("Application startup complete")
    yield
    logger.info("Application shutdown complete")


app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    client_host = request.client.host if request.client else "unknown"
    now = time.monotonic()
    bucket = request_buckets[client_host]
    while bucket and now - bucket[0] > rate_limit_window:
        bucket.popleft()
    if request.url.path.startswith(settings.api_prefix) and request.url.path != f"{settings.api_prefix}/health":
        if len(bucket) >= settings.rate_limit_per_minute:
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded. Please try again shortly."},
            )
        bucket.append(now)

    start = time.perf_counter()
    response = await call_next(request)
    duration_ms = (time.perf_counter() - start) * 1000
    logger.info(
        "%s %s -> %s in %.2fms",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
    )
    return response


@app.get("/")
def root() -> dict[str, str]:
    return {"message": "AI Resume Analyzer API is running."}


app.include_router(health_router, prefix=settings.api_prefix)
app.include_router(upload_router, prefix=settings.api_prefix)
app.include_router(analysis_router, prefix=settings.api_prefix)
app.include_router(history_router, prefix=settings.api_prefix)
app.include_router(job_match_router, prefix=settings.api_prefix)
app.include_router(cover_letter_router, prefix=settings.api_prefix)
app.include_router(interview_router, prefix=settings.api_prefix)
app.include_router(profile_router, prefix=settings.api_prefix)
app.include_router(export_router, prefix=settings.api_prefix)
app.include_router(auth_router, prefix=settings.api_prefix)