from __future__ import annotations

from fastapi import APIRouter

from app.routers.analysis import router as analysis_router
from app.routers.health import router as health_router
from app.routers.history import router as history_router
from app.routers.upload import router as upload_router


api_router = APIRouter(prefix="/api")
api_router.include_router(health_router)
api_router.include_router(upload_router)
api_router.include_router(analysis_router)
api_router.include_router(history_router)