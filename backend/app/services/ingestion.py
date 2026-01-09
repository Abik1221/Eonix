import os
import shutil
import uuid
import git
from app.core.config import settings

class IngestionService:
    def __init__(self):
        self.storage_path = settings.REPO_STORAGE_PATH
        os.makedirs(self.storage_path, exist_ok=True)

    async def ingest_repo(self, repo_url: str):
        """
        Clones a repo to a unique path.
        Returns the project_id (uuid) and the local path.
        """
        project_id = str(uuid.uuid4())
        repo_path = os.path.join(self.storage_path, project_id)
        
        print(f"Cloning {repo_url} to {repo_path}")
        try:
            # In a real app, run this in a threadpool to avoid blocking event loop
            git.Repo.clone_from(repo_url, repo_path)
            language = self.detect_language(repo_path)
            
            # Trigger Extraction
            await self.process_repo(project_id, repo_path)

            return {
                "project_id": project_id,
                "path": repo_path,
                "language": language,
                "status": "success"
            }
        except Exception as e:
            # Cleanup on failure
            if os.path.exists(repo_path):
                shutil.rmtree(repo_path)
            raise e

    async def process_repo(self, project_id: str, repo_path: str):
        from app.extractors.manager import extraction_manager
        from app.services.graph_service import graph_service
        
        for root, _, files in os.walk(repo_path):
            for file in files:
                file_path = os.path.join(root, file)
                # content = open(file_path).read() # Handled by manager
                
                # Extract
                result = extraction_manager.extract_file(file_path)
                
                # Save to Graph (Async)
                if result and result.nodes:
                    await graph_service.save_extraction_result(project_id, result)

    def detect_language(self, path: str) -> str:
        """
        Simple heuristic detection.
        """
        if os.path.exists(os.path.join(path, "pom.xml")):
            return "Java"
        if os.path.exists(os.path.join(path, "package.json")):
            return "TypeScript/JavaScript"
        if os.path.exists(os.path.join(path, "go.mod")):
            return "Go"
        if os.path.exists(os.path.join(path, "requirements.txt")) or os.path.exists(os.path.join(path, "pyproject.toml")):
            return "Python"
        return "Unknown"

ingestion_service = IngestionService()
