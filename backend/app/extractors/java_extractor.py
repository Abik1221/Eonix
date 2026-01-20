"""
Java extractor using JavaParser via subprocess.
Calls standalone Java program to extract Spring Boot endpoints and JPA entities.

NO AI. Pure JavaParser AST for HIGH confidence results.
"""

import os
import subprocess
import json
from typing import Optional
from app.extractors.base import BaseExtractor
from app.schemas.uas import (
    ExtractionResult, EndpointNode, DatabaseModelNode, Parameter
)


class JavaExtractor(BaseExtractor):
    """
    Java extractor that uses JavaParser via subprocess.
    
    Extracts:
    - Spring Boot endpoints (@RestController, @GetMapping, etc.)
    - JPA/Hibernate entities (@Entity, @Table)
    - Request/Response parameters
    """
    
    def __init__(self):
        """Initialize Java extractor"""
        self.jar_path = self._find_jar()
        self.available = self.jar_path is not None
        
        if not self.available:
            print("⚠️  Java extractor JAR not found. Build it with:")
            print("   cd backend/vendor/java-extractor && mvn clean package")
    
    def _find_jar(self) -> Optional[str]:
        """Find the Java extractor JAR file"""
        # Look for JAR in vendor directory
        jar_paths = [
            "vendor/java-extractor/target/java-extractor.jar",
            "backend/vendor/java-extractor/target/java-extractor.jar",
            "../vendor/java-extractor/target/java-extractor.jar",
        ]
        
        for jar_path in jar_paths:
            if os.path.exists(jar_path):
                return os.path.abspath(jar_path)
        
        return None
    
    def extract(self, file_path: str, content: str) -> ExtractionResult:
        """
        Extract facts from Java file.
        
        Args:
            file_path: Path to Java file
            content: File content (not used, we pass file path to JAR)
            
        Returns:
            ExtractionResult with nodes and edges
        """
        if not self.available:
            return ExtractionResult(
                nodes=[],
                edges=[],
                confidence="LOW",
                warnings=["Java extractor not available"]
            )
        
        try:
            # Call Java extractor
            result = subprocess.run(
                ["java", "-jar", self.jar_path, file_path],
                capture_output=True,
                text=True,
                timeout=30  # 30 second timeout
            )
            
            if result.returncode != 0:
                return ExtractionResult(
                    nodes=[],
                    edges=[],
                    confidence="LOW",
                    errors=[f"Java extractor failed: {result.stderr}"]
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
                edges=[],  # Edges will be created later from relationships
                confidence=data.get("confidence", "HIGH")
            )
            
        except subprocess.TimeoutExpired:
            return ExtractionResult(
                nodes=[],
                edges=[],
                confidence="LOW",
                errors=["Java extraction timeout"]
            )
        except Exception as e:
            return ExtractionResult(
                nodes=[],
                edges=[],
                confidence="LOW",
                errors=[f"Java extraction error: {str(e)}"]
            )
    
    def _convert_node(self, node_data: dict):
        """Convert JSON node to UAS node"""
        node_type = node_data.get("type")
        
        if node_type == "Endpoint":
            # Convert parameters
            parameters = []
            for param_data in node_data.get("parameters", []):
                parameters.append(Parameter(
                    name=param_data["name"],
                    type=param_data["type"],
                    source=param_data.get("source", "query"),
                    required=True
                ))
            
            return EndpointNode(
                id=node_data["id"],
                name=node_data["name"],
                file_path=node_data["file_path"],
                line_number=node_data["line_number"],
                method=node_data["method"],
                path=node_data["path"],
                parameters=parameters,
                response_type=node_data.get("response_type"),
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
