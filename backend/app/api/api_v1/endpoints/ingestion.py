from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ingestion import ingestion_service

router = APIRouter()

class IngestRequest(BaseModel):
    repo_url: str
    provider: str = "github"

@router.post("/")
async def ingest_repository(request: IngestRequest):
    try:
        result = await ingestion_service.ingest_repo(request.repo_url)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to ingest repo: {str(e)}")
