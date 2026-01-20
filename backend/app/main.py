from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional
import uuid
import os
import shutil

from app.services.ingestion import ingestion_service, RepositoryScanner
from app.extractors.manager import extraction_manager
from app.services.graph_service import graph_service
from app.services.detector import LanguageDetector
from app.schemas.uas import ExtractionResult

app = FastAPI(title="Eonix API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class IngestRequest(BaseModel):
    repo_url: str

class IngestResponse(BaseModel):
    project_id: str
    status: str

@app.on_event("startup")
async def startup_event():
    try:
        await graph_service.initialize_schema()
        print("✅ Connected to Neo4j")
    except Exception as e:
        print(f"⚠️ Neo4j connection failed: {e}")
        print("🔄 Switching to IN-MEMORY MOCK mode (as requested)")
        
        # Re-initialize graph service in mock mode
        from app.services.graph_service import GraphService
        global graph_service
        graph_service = GraphService(use_mock=True)
        await graph_service.initialize_schema()

@app.get("/")
def read_root():
    return {"status": "online", "system": "Eonix Static Analysis Engine"}

@app.post("/api/v1/repos/ingest", response_model=IngestResponse)
async def ingest_repository(request: IngestRequest, background_tasks: BackgroundTasks):
    """
    Start ingestion of a git repository.
    1. Clone
    2. Detect Language
    3. Extract Facts
    4. Save to Neo4j
    """
    project_id = str(uuid.uuid4())
    background_tasks.add_task(process_repository, project_id, request.repo_url)
    return {"project_id": project_id, "status": "processing_started"}

@app.get("/api/v1/repos/{project_id}/graph")
async def get_project_graph(project_id: str):
    """Get full graph for visualization"""
    try:
        data = await graph_service.get_full_graph(project_id)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/repos/{project_id}/stats")
async def get_project_stats(project_id: str):
    """Get project statistics"""
    return await graph_service.get_project_statistics(project_id)

async def process_repository(project_id: str, repo_url: str):
    """Background task to process the repository"""
    print(f"🚀 Starting processing for {project_id}...")
    
    # 1. Clone (Mocked for now or using ingestion service)
    # real implementation would store in configured path
    repo_path = f"/tmp/eonix_repos/{project_id}"
    
    try:
        if os.path.exists(repo_path):
            shutil.rmtree(repo_path)
        
        # In a real scenario, use ingestion_service.clone_repo(repo_url)
        # For now, we assume local path or use simple git clone
        print(f"   Cloning {repo_url}...")
        os.system(f"git clone {repo_url} {repo_path}")
        
        # 2. Detect
        print("   Detecting language...")
        detector = LanguageDetector(repo_path)
        detection = detector.detect()
        
        # 3. Scan & Extract
        print("   Scanning & Extracting...")
        scanner = RepositoryScanner()
        files = scanner.scan(repo_path)
        
        all_nodes = []
        all_edges = []
        
        for file in files:
            res = extraction_manager.extract_file(file.path)
            # Add project_id to nodes for filtering
            for node in res.nodes:
                if not hasattr(node, 'project_id'):
                    # Hack: dynamically add attribute if model allows extras
                    # Ideally, ExtractionResult should carry context
                    pass 
            all_nodes.extend(res.nodes)
            all_edges.extend(res.edges)
            
        # 4. Save
        print("   Saving to Graph...")
        result = ExtractionResult(
            nodes=all_nodes, 
            edges=all_edges, 
            confidence="HIGH"
        )
        await graph_service.save_extraction_result(project_id, result)
        
        print(f"✅ Processing complete for {project_id}")
        
    except Exception as e:
        print(f"❌ Processing failed: {e}")
    finally:
        # Cleanup if configured
        # shutil.rmtree(repo_path)
        pass
