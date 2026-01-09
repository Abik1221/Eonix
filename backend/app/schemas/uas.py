from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class UASNode(BaseModel):
    id: str = Field(..., description="Unique identifier for the node")
    name: str
    type: str = Field(..., description="Service, Endpoint, Database, etc.")
    file_path: str
    line_number: int
    metadata: Dict[str, Any] = {}

class ServiceNode(UASNode):
    type: str = "Service"
    language: str
    framework: Optional[str] = None

class EndpointNode(UASNode):
    type: str = "Endpoint"
    method: str  # GET, POST, etc.
    path: str
    parameters: List[str] = []
    response_type: Optional[str] = None

class DatabaseModelNode(UASNode):
    type: str = "DatabaseModel"
    table_name: str
    columns: List[str] = []

class DependencyEdge(BaseModel):
    source_id: str
    target_id: str
    type: str = Field(..., description="CALLS, OWNS, DEPENDS_ON")
    metadata: Dict[str, Any] = {}

class ExtractionResult(BaseModel):
    nodes: List[UASNode]
    edges: List[DependencyEdge]
