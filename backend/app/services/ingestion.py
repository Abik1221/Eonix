import os
import shutil
import uuid
import git
from typing import Dict, Any
from app.core.config import settings
from app.services.scanner import RepositoryScanner
from app.services.detector import LanguageDetector

class IngestionService:
    def __init__(self):
        self.storage_path = settings.REPO_STORAGE_PATH
        os.makedirs(self.storage_path, exist_ok=True)

    async def ingest_repo(self, repo_url: str) -> Dict[str, Any]:
        """
        Clones a repo to a unique path and performs full analysis.
        Returns the project_id (uuid) and analysis results.
        """
        project_id = str(uuid.uuid4())
        repo_path = os.path.join(self.storage_path, project_id)
        
        print(f"🔄 Cloning {repo_url} to {repo_path}")
        try:
            # Clone repository
            git.Repo.clone_from(repo_url, repo_path)
            
            # Phase 1: Language & Framework Detection
            print(f"🔍 Detecting language and frameworks...")
            detector = LanguageDetector(repo_path)
            detection_result = detector.detect()
            
            print(f"✅ Detected: {detection_result.primary_language.value}")
            print(f"📦 Frameworks: {[f.name for f in detection_result.frameworks]}")
            
            # Phase 2: File Scanning
            print(f"📁 Scanning files...")
            scanner = RepositoryScanner()
            scanner.load_eonixignore(repo_path)
            files = scanner.scan(repo_path)
            scanner.print_statistics()
            
            # Phase 3: Extraction
            print(f"⚙️  Extracting architectural facts...")
            await self.process_repo(project_id, repo_path, files)

            return {
                "project_id": project_id,
                "path": repo_path,
                "primary_language": detection_result.primary_language.value,
                "frameworks": [f.name for f in detection_result.frameworks],
                "total_files": len(files),
                "confidence": detection_result.confidence.value,
                "is_monorepo": detection_result.is_monorepo,
                "architecture_type": detection_result.architecture_type,
                "status": "success"
            }
        except Exception as e:
            # Cleanup on failure
            if os.path.exists(repo_path):
                shutil.rmtree(repo_path)
            raise e

    async def process_repo(self, project_id: str, repo_path: str, files: list):
        """Process repository files and extract facts"""
        from app.extractors.manager import extraction_manager
        from app.services.graph_service import graph_service
        
        total_files = len(files)
        processed = 0
        
        for file_info in files:
            # Extract architectural facts
            result = extraction_manager.extract_file(file_info.path)
            
            # Save to Graph (Async)
            if result and result.nodes:
                await graph_service.save_extraction_result(project_id, result)
            
            processed += 1
            if processed % 10 == 0:
                print(f"  Progress: {processed}/{total_files} files processed")
        
        print(f"✅ Extraction complete: {processed} files processed")

ingestion_service = IngestionService()
