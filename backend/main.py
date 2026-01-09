from contextlib import asynccontextmanager
from fastapi import FastAPI
from app.core.config import settings
from app.db.neo4j import neo4j_client
from app.api.api_v1.api import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Connecting to Neo4j...")
    try:
        neo4j_client.connect(
            settings.NEO4J_URI,
            (settings.NEO4J_USER, settings.NEO4J_PASSWORD)
        )
        print("Neo4j driver initialized.")
    except Exception as e:
        print(f"Warning: Neo4j connection failed: {e}")
    
    yield
    
    # Shutdown
    print("Closing Neo4j connection...")
    await neo4j_client.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {"message": "Eonix API Engine"}

@app.get("/health")
async def health_check():
    return {"status": "ok", "services": {"neo4j": "connected"}} # TODO: Real check
