from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Eonix API"
    
    # Neo4j
    NEO4J_URI: str = "bolt://localhost:7687"
    NEO4J_USER: str = "neo4j"
    NEO4J_PASSWORD: str = "password"
    
    # Postgres
    POSTGRES_URI: str = "postgresql+asyncpg://user:password@localhost/dbname"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Storage
    REPO_STORAGE_PATH: str = "/tmp/eonix_repos"

    class Config:
        case_sensitive = True

settings = Settings()
