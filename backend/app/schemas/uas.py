"""
Universal Architecture Schema (UAS)
Normalized data models for representing architecture across all languages.

Language-specific extractors → UAS → Neo4j Graph
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from enum import Enum


class ConfidenceLevel(str, Enum):
    """Extraction confidence levels"""
    HIGH = "HIGH"      # AST/Tree-sitter parsing
    MEDIUM = "MEDIUM"  # Heuristics with validation
    LOW = "LOW"        # Regex fallback


class EdgeType(str, Enum):
    """Types of relationships between nodes"""
    CALLS = "CALLS"                    # Service calls another service
    OWNS = "OWNS"                      # Service owns a database/table
    CACHES = "CACHES"                  # Service uses cache
    EMITS = "EMITS"                    # Service emits event
    CONSUMES = "CONSUMES"              # Service consumes event
    DEPENDS_ON = "DEPENDS_ON"          # General dependency
    CALLS_EXTERNAL = "CALLS_EXTERNAL"  # Calls external API
    EXPOSES = "EXPOSES"                # Service exposes endpoint


# Base Models

class UASNode(BaseModel):
    """Base class for all architecture nodes"""
    id: str = Field(..., description="Unique identifier for the node")
    name: str
    type: str = Field(..., description="Node type: Service, Endpoint, Database, etc.")
    file_path: str
    line_number: int
    metadata: Dict[str, Any] = Field(default_factory=dict)
    confidence: ConfidenceLevel = ConfidenceLevel.HIGH
    extraction_method: str = "ast"  # "ast", "tree-sitter", "regex"


class Parameter(BaseModel):
    """Function/endpoint parameter"""
    name: str
    type: str = "Any"
    source: str = "query"  # "path", "query", "body", "header"
    required: bool = True
    default: Optional[str] = None


# Node Types

class ServiceNode(UASNode):
    """Represents a service/application"""
    type: str = "Service"
    language: str
    framework: Optional[str] = None
    version: Optional[str] = None


class EndpointNode(UASNode):
    """API endpoint (HTTP, GraphQL, gRPC)"""
    type: str = "Endpoint"
    method: str  # GET, POST, etc.
    path: str
    parameters: List[Parameter] = Field(default_factory=list)
    response_type: Optional[str] = None


class DatabaseModelNode(UASNode):
    """Database table/model representation"""
    type: str = "DatabaseModel"
    table_name: str
    columns: List[str] = Field(default_factory=list)
    indexes: List[str] = Field(default_factory=list)
    relationships: List[str] = Field(default_factory=list)


class CacheNode(UASNode):
    """Cache instance (Redis, Memcached, etc.)"""
    type: str = "Cache"
    technology: str  # "Redis", "Memcached"
    host: Optional[str] = None
    port: Optional[int] = None
    ttl: Optional[int] = None  # Default TTL in seconds
    key_pattern: Optional[str] = None


class EventNode(UASNode):
    """Event/message queue topic"""
    type: str = "Event"
    technology: str  # "Kafka", "RabbitMQ", "SNS/SQS"
    topic_name: str
    schema: Optional[Dict] = None
    partition_key: Optional[str] = None


class ExternalAPINode(UASNode):
    """External API/service dependency"""
    type: str = "ExternalAPI"
    provider: str  # "Stripe", "Twilio", "SendGrid", etc.
    base_url: str
    endpoints_called: List[str] = Field(default_factory=list)
    api_version: Optional[str] = None


class ConfigNode(UASNode):
    """Configuration/environment variable"""
    type: str = "Configuration"
    env_var: str
    default_value: Optional[str] = None
    required: bool = False
    sensitive: bool = False  # Is it a secret?


# Edge Types

class DependencyEdge(BaseModel):
    """Base edge for all relationships"""
    source_id: str
    target_id: str
    type: EdgeType = EdgeType.DEPENDS_ON
    metadata: Dict[str, Any] = Field(default_factory=dict)


class ServiceCallEdge(DependencyEdge):
    """Service-to-service call"""
    type: EdgeType = EdgeType.CALLS
    protocol: str = "HTTP"  # "HTTP", "gRPC", "GraphQL"
    method: Optional[str] = None  # For HTTP: GET, POST, etc.


class OwnershipEdge(DependencyEdge):
    """Service owns a database/table"""
    type: EdgeType = EdgeType.OWNS
    access_pattern: str = "READ_WRITE"  # "READ", "WRITE", "READ_WRITE"


class CacheEdge(DependencyEdge):
    """Service uses cache"""
    type: EdgeType = EdgeType.CACHES
    operations: List[str] = Field(default_factory=list)  # ["get", "set", "delete"]


class EventEmitEdge(DependencyEdge):
    """Service emits/produces event"""
    type: EdgeType = EdgeType.EMITS


class EventConsumeEdge(DependencyEdge):
    """Service consumes event"""
    type: EdgeType = EdgeType.CONSUMES


# Extraction Result

class ExtractionResult(BaseModel):
    """Result of extraction from a single file"""
    nodes: List[UASNode]
    edges: List[DependencyEdge]
    confidence: ConfidenceLevel = ConfidenceLevel.HIGH
    errors: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    
    class Config:
        # Allow subclass instances in lists
        arbitrary_types_allowed = True
