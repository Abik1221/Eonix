from fastapi import APIRouter
from app.api.api_v1.endpoints import ingestion

api_router = APIRouter()
api_router.include_router(ingestion.router, prefix="/ingestion", tags=["ingestion"])
