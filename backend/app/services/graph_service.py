"""
Enhanced Neo4j Graph Service for architecture storage and querying.
Handles schema creation, batch insertion, and cypher queries.
"""

from typing import List, Dict, Any, Optional
from app.db.neo4j import neo4j_client
from app.schemas.uas import ExtractionResult, UASNode, DependencyEdge
import logging

logger = logging.getLogger(__name__)


class GraphService:
    def __init__(self, use_mock: bool = False):
        self.use_mock = use_mock
        self._mock_nodes = {}  # id -> dict
        self._mock_edges = []  # list of dicts

    """
    Service for persisting and querying architecture graph in Neo4j.
    
    Features:
    - Schema initialization with constraints and indexes
    - Batch node/edge insertion
    - Query interface for common patterns
    - Anti-pattern detection
    """
    
    async def initialize_schema(self):
        """
        Create Neo4j schema: constraints, indexes, and initial setup.
        Run this once when setting up the database.
        """
        if self.use_mock:
            logger.info("🔧 [MOCK] Initializing in-memory schema (skipped Neo4j setup)")
            return

        logger.info("🔧 Initializing Neo4j schema...")
        
        # Create constraints (ensures uniqueness and creates index automatically)
        constraints = [
            "CREATE CONSTRAINT node_id_unique IF NOT EXISTS FOR (n:CodeNode) REQUIRE n.id IS UNIQUE",
            "CREATE CONSTRAINT project_id_exists IF NOT EXISTS FOR (p:Project) REQUIRE p.id IS NOT NULL",
        ]
        
        # Create indexes for faster queries
        indexes = [
            "CREATE INDEX node_type_idx IF NOT EXISTS FOR (n:CodeNode) ON (n.type)",
            "CREATE INDEX node_file_path_idx IF NOT EXISTS FOR (n:CodeNode) ON (n.file_path)",
            "CREATE INDEX project_id_idx IF NOT EXISTS FOR (n:CodeNode) ON (n.project_id)",
            "CREATE INDEX endpoint_method_idx IF NOT EXISTS FOR (n:Endpoint) ON (n.method)",
            "CREATE INDEX endpoint_path_idx IF NOT EXISTS FOR (n:Endpoint) ON (n.path)",
            "CREATE INDEX model_table_idx IF NOT EXISTS FOR (n:DatabaseModel) ON (n.table_name)",
        ]
        
        try:
            for constraint in constraints:
                await neo4j_client.execute_query(constraint)
                logger.info(f"  ✅ Created constraint")
            
            for index in indexes:
                await neo4j_client.execute_query(index)
                logger.info(f"  ✅ Created index")
            
            logger.info("✅ Schema initialization complete")
            
        except Exception as e:
            logger.error(f"❌ Schema initialization failed: {e}")
            raise
    
    async def save_extraction_result(
        self,
        project_id: str,
        result: ExtractionResult,
        batch_size: int = 100
    ):
        """
        Save extraction result to Neo4j with batch processing.
        
        Args:
            project_id: Unique project identifier
            result: ExtractionResult with nodes and edges
            batch_size: Number of nodes to insert per batch
        """
        if not result.nodes and not result.edges:
            logger.warning(f"No nodes or edges to save for project {project_id}")
            return
        
        logger.info(f"💾 Saving {len(result.nodes)} nodes and {len(result.edges)} edges for project {project_id}")
        
        # Save nodes in batches
        await self._save_nodes_batch(project_id, result.nodes, batch_size)
        
        # Save edges (relationships)
        if result.edges:
            await self._save_edges_batch(result.edges, batch_size)
        
        logger.info(f"✅ Saved extraction result for project {project_id}")
    
    async def _save_nodes_batch(
        self,
        project_id: str,
        nodes: List[UASNode],
        batch_size: int
    ):
        """Save nodes in batches for better performance"""
        
        for i in range(0, len(nodes), batch_size):
            batch = nodes[i:i + batch_size]
            nodes_data = []
            
            for node in batch:
                node_dict = node.model_dump()
                # Ensure parameters are serializable
                if 'parameters' in node_dict and node_dict['parameters']:
                    node_dict['parameters'] = [p.model_dump() if hasattr(p, 'model_dump') else p 
                                               for p in node_dict['parameters']]
                nodes_data.append(node_dict)
            
            # Cypher query for batch insert with MERGE (upsert)
            query = """
            UNWIND $nodes AS node
            MERGE (n:CodeNode {id: node.id})
            SET n.name = node.name,
                n.type = node.type,
                n.file_path = node.file_path,
                n.line_number = node.line_number,
                n.project_id = $project_id,
                n.confidence = node.confidence,
                n.metadata = node.metadata,
                n.method = node.method,
                n.path = node.path,
                n.parameters = node.parameters,
                n.response_type = node.response_type,
                n.table_name = node.table_name,
                n.columns = node.columns,
                n.technology = node.technology,
                n.host = node.host,
                n.port = node.port,
                n.provider = node.provider,
                n.base_url = node.base_url
            WITH n, node
            // Add type-specific label
            CALL apoc.create.addLabels(n, [node.type]) YIELD node as labeledNode
            RETURN count(labeledNode) as created
            """
            
            try:
                if self.use_mock:
                    # Mock insertion
                    for node in nodes_data:
                        self._mock_nodes[node['id']] = node
                        logger.debug(f"  [MOCK] Saved node {node['id']}")
                else:
                    await neo4j_client.execute_query(
                        query,
                        {"nodes": nodes_data, "project_id": project_id}
                    )
                logger.debug(f"  ✅ Saved batch of {len(batch)} nodes")
            except Exception as e:
                logger.error(f"  ❌ Failed to save nodes batch: {e}")
                # Try without APOC for simpler version
                await self._save_nodes_simple(project_id, batch)
    
    async def _save_nodes_simple(self, project_id: str, nodes: List[UASNode]):
        """Fallback: Save nodes without APOC (simpler but slower)"""
        query = """
        UNWIND $nodes AS node
        MERGE (n:CodeNode {id: node.id})
        SET n += node,
            n.project_id = $project_id
        RETURN count(n) as created
        """
        
        nodes_data = [node.model_dump() for node in nodes]
        await neo4j_client.execute_query(query, {"nodes": nodes_data, "project_id": project_id})
    
    async def _save_edges_batch(self, edges: List[DependencyEdge], batch_size: int):
        """Save edges in batches"""
        
        for i in range(0, len(edges), batch_size):
            batch = edges[i:i + batch_size]
            edges_data = [edge.model_dump() for edge in batch]
            
            query = """
            UNWIND $edges AS edge
            MATCH (source:CodeNode {id: edge.source_id})
            MATCH (target:CodeNode {id: edge.target_id})
            CALL apoc.create.relationship(
                source,
                edge.type,
                edge.metadata,
                target
            ) YIELD rel
            RETURN count(rel) as created
            """
            
            try:
                if self.use_mock:
                    for edge in edges_data:
                        self._mock_edges.append(edge)
                        logger.debug(f"  [MOCK] Saved edge {edge['source_id']} -> {edge['target_id']}")
                else:
                    await neo4j_client.execute_query(query, {"edges": edges_data})
                logger.debug(f"  ✅ Saved batch of {len(batch)} edges")
            except Exception as e:
                logger.error(f"  ❌ Failed to save edges batch: {e}")
                # Fallback without APOC
                await self._save_edges_simple(batch)
    
    async def _save_edges_simple(self, edges: List[DependencyEdge]):
        """Fallback: Save edges without APOC"""
        for edge in edges:
            query = f"""
            MATCH (source:CodeNode {{id: $source_id}})
            MATCH (target:CodeNode {{id: $target_id}})
            MERGE (source)-[r:{edge.type}]->(target)
            SET r += $metadata
            RETURN r
            """
            
            await neo4j_client.execute_query(
                query,
                {
                    "source_id": edge.source_id,
                    "target_id": edge.target_id,
                    "metadata": edge.metadata
                }
            )
    
    # Query Interface
    
    async def get_all_endpoints(self, project_id: str) -> List[Dict[str, Any]]:
        """Get all API endpoints for a project"""
        if self.use_mock:
            return [n for n in self._mock_nodes.values() 
                    if n.get('project_id') == project_id and n.get('type') == 'Endpoint']

        query = """
        MATCH (n:Endpoint {project_id: $project_id})
        RETURN n.id as id,
               n.name as name,
               n.method as method,
               n.path as path,
               n.file_path as file_path,
               n.line_number as line_number,
               n.confidence as confidence
        ORDER BY n.path
        """
        
        result = await neo4j_client.execute_query(query, {"project_id": project_id})
        return [dict(record) for record in result.records] if result.records else []
    
    async def get_all_database_models(self, project_id: str) -> List[Dict[str, Any]]:
        """Get all database models for a project"""
        if self.use_mock:
            return [n for n in self._mock_nodes.values() 
                    if n.get('project_id') == project_id and n.get('type') == 'DatabaseModel']

        query = """
        MATCH (n:DatabaseModel {project_id: $project_id})
        RETURN n.id as id,
               n.name as name,
               n.table_name as table_name,
               n.columns as columns,
               n.file_path as file_path,
               n.confidence as confidence
        ORDER BY n.table_name
        """
        
        result = await neo4j_client.execute_query(query, {"project_id": project_id})
        return [dict(record) for record in result.records] if result.records else []
    
    async def get_service_dependencies(self, project_id: str) -> List[Dict[str, Any]]:
        """Get all service dependencies (edges)"""
        query = """
        MATCH (source:CodeNode {project_id: $project_id})-[r]->(target:CodeNode)
        RETURN source.name as source_name,
               type(r) as relationship_type,
               target.name as target_name,
               source.type as source_type,
               target.type as target_type
        """
        
        result = await neo4j_client.execute_query(query, {"project_id": project_id})
        return [dict(record) for record in result.records] if result.records else []
    
    async def find_shared_databases(self, project_id: str) -> List[Dict[str, Any]]:
        """
        Anti-pattern detection: Find database tables accessed by multiple services.
        """
        query = """
        MATCH (db:DatabaseModel {project_id: $project_id})
        MATCH (service:CodeNode)-[:OWNS]->(db)
        WITH db, collect(DISTINCT service.name) as services
        WHERE size(services) > 1
        RETURN db.table_name as table_name,
               db.name as model_name,
               services,
               size(services) as service_count
        ORDER BY service_count DESC
        """
        
        result = await neo4j_client.execute_query(query, {"project_id": project_id})
        return [dict(record) for record in result.records] if result.records else []
    
    async def get_external_dependencies(self, project_id: str) -> List[Dict[str, Any]]:
        """Get all external API dependencies"""
        query = """
        MATCH (n:ExternalAPI {project_id: $project_id})
        RETURN n.provider as provider,
               n.base_url as base_url,
               n.file_path as file_path,
               n.confidence as confidence
        """
        
        result = await neo4j_client.execute_query(query, {"project_id": project_id})
        return [dict(record) for record in result.records] if result.records else []
    
    async def get_project_statistics(self, project_id: str) -> Dict[str, Any]:
        """Get comprehensive statistics for a project"""
        query = """
        MATCH (n:CodeNode {project_id: $project_id})
        WITH n.type as node_type, count(*) as count
        RETURN collect({type: node_type, count: count}) as stats
        """
        
        if self.use_mock:
            stats = {}
            for n in self._mock_nodes.values():
                if n.get('project_id') == project_id:
                    t = n.get('type', 'Unknown')
                    stats[t] = stats.get(t, 0) + 1
            return stats

        result = await neo4j_client.execute_query(query, {"project_id": project_id})
        
        stats = {}
        if result.records and result.records[0]["stats"]:
            for item in result.records[0]["stats"]:
                stats[item["type"]] = item["count"]
        
        return stats
    
    async def get_full_graph(self, project_id: str) -> Dict[str, List[Dict]]:
        """
        Retrieve the completely connected graph for visualization.
        Returns format suitable for Vis.js / ReactFlow:
        {
            "nodes": [{id, label, type, ...}],
            "edges": [{from, to, type, ...}]
        }
        """
        if self.use_mock:
            # Return in-memory graph
            nodes = []
            for n in self._mock_nodes.values():
                if n.get('project_id') == project_id:
                    # Add color for viz
                    node = n.copy()
                    node['label'] = n.get('name')
                    node['group'] = n.get('type')
                    node['title'] = n.get('file_path')
                    
                    color = "#97c2fc"
                    if node['group'] == 'Service': color = "#ffcf00"
                    elif node['group'] == 'Endpoint': color = "#fb7e81"
                    elif node['group'] == 'DatabaseModel': color = "#7be141"
                    node['color'] = color
                    nodes.append(node)
            
            edges = []
            for e in self._mock_edges:
                # Mock edges don't have project_id but we assume session isolation or check source
                source = self._mock_nodes.get(e['source_id'])
                if source and source.get('project_id') == project_id:
                    edges.append({
                        "from": e['source_id'],
                        "to": e['target_id'],
                        "label": e['type'],
                        "arrows": "to"
                    })
            return {"nodes": nodes, "edges": edges}

        # Get all nodes
        nodes_query = """
        MATCH (n:CodeNode {project_id: $project_id})
        RETURN n.id as id, 
               n.name as label, 
               n.type as group, 
               n.file_path as title,
               n.confidence as confidence
        """
        
        # Get all relationships
        edges_query = """
        MATCH (s:CodeNode {project_id: $project_id})-[r]->(t:CodeNode)
        RETURN s.id as source, 
               type(r) as type, 
               t.id as target
        """
        
        nodes_res = await neo4j_client.execute_query(nodes_query, {"project_id": project_id})
        edges_res = await neo4j_client.execute_query(edges_query, {"project_id": project_id})
        
        nodes = []
        if nodes_res.records:
            for record in nodes_res.records:
                node = dict(record)
                # Assign colors based on node type for visualization
                color = "#97c2fc"  # default blue
                if node['group'] == 'Service': color = "#ffcf00"
                elif node['group'] == 'Endpoint': color = "#fb7e81"
                elif node['group'] == 'DatabaseModel': color = "#7be141"
                
                node['color'] = color
                nodes.append(node)

        edges = []
        if edges_res.records:
            for record in edges_res.records:
                edge = {
                    "from": record["source"],
                    "to": record["target"],
                    "label": record["type"],
                    "arrows": "to"
                }
                edges.append(edge)
                
        return {"nodes": nodes, "edges": edges}

    async def delete_project(self, project_id: str):
        """Delete all nodes and relationships for a project"""
        query = """
        MATCH (n:CodeNode {project_id: $project_id})
        DETACH DELETE n
        """
        
        await neo4j_client.execute_query(query, {"project_id": project_id})
        logger.info(f"🗑️  Deleted all data for project {project_id}")


graph_service = GraphService()
