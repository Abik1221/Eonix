from abc import ABC, abstractmethod
from app.schemas.uas import ExtractionResult

class BaseExtractor(ABC):
    @abstractmethod
    def extract(self, file_path: str, content: str) -> ExtractionResult:
        """
        Extract architectural elements from source code.
        """
        pass
