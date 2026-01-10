from app.db.neo4j import neo4j_client
from app.schemas.uas import UASNode, DependencyEdge, ExtractionResult
import logging

logger = logging.getLogger(__name__)

class GraphService:
    async def save_extraction_result(self, project_id: str, result: ExtractionResult):
        """
        Persists extracted nodes and edges to Neo4j.
        """
        query_nodes = """
        UNWIND $nodes AS node
        MERGE (n:CodeNode {id: node.id})
        SET n += node.metadata,
            n.name = node.name,
            n.type = node.type,
            n.file_path = node.file_path,
            n.line_number = node.line_number,
            n.project_id = $project_id
        WITH n, node
        CALL apoc.create.addLabels(n, [node.type]) YIELD node as lblNode
        RETURN count(lblNode)
        """
        
        # Serialize nodes to dict
        nodes_data = [node.model_dump() for node in result.nodes]
        
        try:
            await neo4j_client.execute_query(query_nodes, {"nodes": nodes_data, "project_id": project_id})
        except Exception as e:
            logger.error(f"Failed to save nodes: {e}")
            raise e

        query_edges = """
        UNWIND $edges AS edge
        MATCH (s:CodeNode {id: edge.source_id})
        MATCH (t:CodeNode {id: edge.target_id})
        CALL apoc.create.relationship(s, edge.type, edge.metadata, t) YIELD rel
        RETURN count(rel)
        """
        
        edges_data = [edge.model_dump() for edge in result.edges]
        
        try:
            await neo4j_client.execute_query(query_edges, {"edges": edges_data})
        except Exception as e:
            logger.error(f"Failed to save edges: {e}")
            raise e

    async def get_layer_data(self, project_id: str, layer_id: str):
        """
        Retrieves graph data specifically tailored for the requested visualization layer.
        Currently returns MOCK data for demonstration of the 7-layer system.
        """
        # Mock Data Generation based on Layer
        if layer_id == 'layer-0': # Executive Overview
            return {
                "type": "mermaid",
                "definition": """
                graph TD
                    Client(Client Apps) --> Gateway[API Gateway]
                    Gateway --> Auth[Auth Service]
                    Gateway --> Core[Core API]
                    Core --> DB[(Primary DB)]
                    Auth --> DB
                """
            }
        
        elif layer_id == 'layer-1': # Service Map
            return {
                "type": "reactflow",
                "nodes": [
                    {"id": "gateway", "type": "default", "data": {"label": "API Gateway"}, "position": {"x": 250, "y": 50}},
                    {"id": "auth", "type": "default", "data": {"label": "Auth Service"}, "position": {"x": 100, "y": 200}},
                    {"id": "core", "type": "default", "data": {"label": "Core Service"}, "position": {"x": 400, "y": 200}},
                    {"id": "db", "type": "output", "data": {"label": "PostgreSQL"}, "position": {"x": 250, "y": 350}},
                ],
                "edges": [
                    {"id": "e1", "source": "gateway", "target": "auth", "animated": True, "label": "HTTP"},
                    {"id": "e2", "source": "gateway", "target": "core", "animated": True, "label": "HTTP"},
                    {"id": "e3", "source": "auth", "target": "db", "label": "SQL"},
                    {"id": "e4", "source": "core", "target": "db", "label": "SQL"},
                ]
            }

        elif layer_id == 'layer-2': # API Mapping
            return {
                "type": "json",
                "data": [
                    {"method": "POST", "path": "/api/v1/auth/login", "service": "Auth Service", "status": "active"},
                    {"method": "GET", "path": "/api/v1/users/me", "service": "Auth Service", "status": "active"},
                    {"method": "POST", "path": "/api/v1/orders", "service": "Core Service", "status": "active"},
                    {"method": "DELETE", "path": "/api/v1/orders/{id}", "service": "Core Service", "status": "deprecated"},
                ]
            }
            
        elif layer_id == 'layer-7': # Security Flow
            return {
                "type": "mermaid",
                "definition": """
                sequenceDiagram
                    participant User
                    participant FE as Frontend
                    participant GW as API Gateway
                    participant Auth as Auth Service
                    
                    User->>FE: Click Login
                    FE->>GW: POST /login
                    GW->>Auth: Forward Credentials
                    Auth-->>GW: Return JWT
                    GW-->>FE: Return JWT
                    FE->>GW: Request + Bearer Token
                    GW->>GW: Validate Token
                """
            }

        return {"type": "empty", "message": "Layer not implemented yet"}

graph_service = GraphService()
