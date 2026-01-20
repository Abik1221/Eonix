"""
Go extractor using go/parser via subprocess.
Calls standalone Go program to extract HTTP handlers and GORM models.

NO AI. Pure go/ast parsing for HIGH confidence results.
"""

import os
import subprocess
import json
from typing import Optional
from app.extractors.base import BaseExtractor
from app.schemas.uas import (
    ExtractionResult, EndpointNode, DatabaseModelNode, Parameter
)


class GoExtractor(BaseExtractor):
    """
    Go extractor that uses go/parser via subprocess.
    
    Extracts:
    - HTTP handlers (standard library, Gin, Echo)
    - GORM database models
    - gRPC services
    """
    
    def __init__(self):
        """Initialize Go extractor"""
        self.binary_path = self._find_binary()
        self.available = self.binary_path is not None
        
        if not self.available:
            print("⚠️  Go extractor binary not found. Build it with:")
            print("   cd backend/vendor/go-extractor && go build -o go-extractor main.go")
    
    def _find_binary(self) -> Optional[str]:
        """Find the Go extractor binary"""
        binary_paths = [
            "vendor/go-extractor/go-extractor",
            "backend/vendor/go-extractor/go-extractor",
            "../vendor/go-extractor/go-extractor",
        ]
        
        for binary_path in binary_paths:
            if os.path.exists(binary_path):
                return os.path.abspath(binary_path)
        
        return None
    
    def extract(self, file_path: str, content: str) -> ExtractionResult:
        """
        Extract facts from Go file.
        
        Args:
            file_path: Path to Go file
            content: File content (not used, we pass file path to binary)
            
        Returns:
            ExtractionResult with nodes and edges
        """
        if not self.available:
            return ExtractionResult(
                nodes=[],
                edges=[],
                confidence="LOW",
                warnings=["Go extractor not available"]
            )
        
        try:
            # Call Go extractor
            result = subprocess.run(
                [self.binary_path, file_path],
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode != 0:
                return ExtractionResult(
                    nodes=[],
                    edges=[],
                    confidence="LOW",
                    errors=[f"Go extractor failed: {result.stderr}"]
                )
            
            # Parse JSON output
            data = json.loads(result.stdout)
            
            # Convert JSON nodes to UAS nodes
            nodes = []
            for node_data in data.get("nodes", []):
                node = self._convert_node(node_data)
                if node:
                    nodes.append(node)
            
            return ExtractionResult(
                nodes=nodes,
                edges=[],
                confidence=data.get("confidence", "HIGH")
            )
            
        except subprocess.TimeoutExpired:
            return ExtractionResult(
                nodes=[],
                edges=[],
                confidence="LOW",
                errors=["Go extraction timeout"]
            )
        except Exception as e:
            return ExtractionResult(
                nodes=[],
                edges=[],
                confidence="LOW",
                errors=[f"Go extraction error: {str(e)}"]
            )
    
    def _convert_node(self, node_data: dict):
        """Convert JSON node to UAS node"""
        node_type = node_data.get("type")
        
        if node_type == "Endpoint":
            parameters = []
            for param_data in node_data.get("parameters", []):
                parameters.append(Parameter(
                    name=param_data["name"],
                    type=param_data["type"],
                    source=param_data.get("source", "query")
                ))
            
            return EndpointNode(
                id=node_data["id"],
                name=node_data["name"],
                file_path=node_data["file_path"],
                line_number=node_data["line_number"],
                method=node_data["method"],
                path=node_data["path"],
                parameters=parameters,
                metadata=node_data.get("metadata", {}),
                confidence=node_data.get("confidence", "HIGH")
            )
        
        elif node_type == "DatabaseModel":
            return DatabaseModelNode(
                id=node_data["id"],
                name=node_data["name"],
                file_path=node_data["file_path"],
                line_number=node_data["line_number"],
                table_name=node_data["table_name"],
                columns=node_data.get("columns", []),
                metadata=node_data.get("metadata", {}),
                confidence=node_data.get("confidence", "HIGH")
            )
        
        return None
