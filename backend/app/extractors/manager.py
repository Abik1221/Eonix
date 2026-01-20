import os
from app.extractors.python_extractor import PythonExtractor
from app.extractors.ts_extractor import TypeScriptExtractor
from app.extractors.java_extractor import JavaExtractor
from app.extractors.go_extractor import GoExtractor
from app.schemas.uas import ExtractionResult

class ExtractionManager:
    """
    Central manager for routing files to appropriate extractors.
    Supports Python, TypeScript, JavaScript, Java, and Go with appropriate AST parsers.
    """
    
    def __init__(self):
        python_extractor = PythonExtractor()
        ts_extractor = TypeScriptExtractor()
        java_extractor = JavaExtractor()
        go_extractor = GoExtractor()
        
        self.extractors = {
            # Python
            ".py": python_extractor,
            ".pyi": python_extractor,
            
            # TypeScript/JavaScript
            ".ts": ts_extractor,
            ".tsx": ts_extractor,
            ".js": ts_extractor,
            ".jsx": ts_extractor,
            ".mjs": ts_extractor,
            ".cjs": ts_extractor,
            
            # Java
            ".java": java_extractor,
            
            # Go
            ".go": go_extractor,
        }

    def extract_file(self, file_path: str) -> ExtractionResult:
        """
        Extract architectural facts from a single file.
        
        Args:
            file_path: Path to the file to extract from
            
        Returns:
            ExtractionResult with nodes and edges
        """
        _, ext = os.path.splitext(file_path)
        extractor = self.extractors.get(ext.lower())
        
        if extractor:
            try:
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                return extractor.extract(file_path, content)
            except Exception as e:
                print(f"⚠️  Error extracting {file_path}: {e}")
                return ExtractionResult(
                    nodes=[],
                    edges=[],
                    confidence="LOW",
                    errors=[str(e)]
                )
        
        # No extractor for this file type
        return ExtractionResult(nodes=[], edges=[], confidence="LOW")

extraction_manager = ExtractionManager()
