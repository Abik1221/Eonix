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

graph_service = GraphService()
