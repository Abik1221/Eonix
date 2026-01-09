import os
from app.extractors.python_extractor import PythonExtractor
from app.extractors.ts_extractor import TSExtractor
from app.schemas.uas import ExtractionResult

class ExtractionManager:
    def __init__(self):
        self.extractors = {
            ".py": PythonExtractor(),
            ".ts": TSExtractor(),
            ".tsx": TSExtractor(),
        }

    def extract_file(self, file_path: str) -> ExtractionResult:
        _, ext = os.path.splitext(file_path)
        extractor = self.extractors.get(ext)
        if extractor:
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                return extractor.extract(file_path, content)
            except Exception as e:
                print(f"Error extracting {file_path}: {e}")
                return ExtractionResult(nodes=[], edges=[])
        return ExtractionResult(nodes=[], edges=[])

extraction_manager = ExtractionManager()
