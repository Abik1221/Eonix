"""
Visualization Generator for Eonix.
Creates a temporary repository, extracts data to Neo4j, and generates an interactive HTML graph.

Usage:
    PYTHONPATH=. python scripts/visualize_graph.py
"""

import asyncio
import os
import json
import shutil
import tempfile
from app.services.scanner import RepositoryScanner
from app.extractors.manager import extraction_manager
from app.services.graph_service import graph_service
from app.schemas.uas import ExtractionResult

# Reuse test repo creation from e2e test logic (simplified)
def create_demo_repo():
    temp_dir = tempfile.mkdtemp()
    os.makedirs(f"{temp_dir}/src", exist_ok=True)
    
    # Python API
    with open(f"{temp_dir}/src/api.py", 'w') as f:
        f.write("""
from fastapi import FastAPI
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import declarative_base

app = FastAPI()
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    name = Column(String)

@app.get("/users")
def get_users():
    return []

@app.post("/users")
def create_user():
    pass
""")

    # TypeScript Frontend
    with open(f"{temp_dir}/src/app.ts", 'w') as f:
        f.write("""
import axios from 'axios';

async def fetchUsers() {
    // Calls external API
    return await axios.get('/users');
}
""")
    
    return temp_dir

async def generate_visualization():
    print("🎨 Generating Architecture Graph Visualization...")
    
    # 1. Setup Data
    project_id = "demo-viz-project"
    repo_path = create_demo_repo()
    print("   ✅ Created demo repository")
    
    try:
        # 2. Extract
        print("   ✅ Extracting facts...")
        scanner = RepositoryScanner()
        files = scanner.scan(repo_path)
        
        all_nodes = []
        all_edges = []
        for file in files:
            res = extraction_manager.extract_file(file.path)
            all_nodes.extend(res.nodes)
            all_edges.extend(res.edges)
            
        # 3. Save to Neo4j
        print("   ✅ Saving to Neo4j...")
        try:
            await graph_service.initialize_schema()
            result = ExtractionResult(nodes=all_nodes, edges=all_edges, confidence="HIGH")
            await graph_service.save_extraction_result(project_id, result)
        except Exception as e:
            print(f"   ❌ Neo4j error: {e}")
            return

        # 4. Get Visualization Data
        print("   ✅ Fetching graph data...")
        graph_data = await graph_service.get_full_graph(project_id)
        
        # 5. Generate HTML
        html_content = create_html(graph_data)
        
        output_file = "architecture_graph.html"
        with open(output_file, "w") as f:
            f.write(html_content)
            
        print(f"\n✨ Success! Open {os.path.abspath(output_file)} in your browser to see the graph.")
        
    finally:
        shutil.rmtree(repo_path)
        # Cleanup Neo4j data
        await graph_service.delete_project(project_id)

def create_html(graph_data):
    nodes_json = json.dumps(graph_data["nodes"])
    edges_json = json.dumps(graph_data["edges"])
    
    return f"""
<!DOCTYPE html>
<html>
<head>
    <title>Eonix Architecture Graph</title>
    <script type="text/javascript" src="https://unpkg.com/vis-network/standalone/umd/vis-network.min.js"></script>
    <style type="text/css">
        body {{ font-family: sans-serif; background: #0f172a; color: white; margin: 0; }}
        #mynetwork {{ width: 100vw; height: 100vh; border: 1px solid #334155; }}
        .legend {{ position: absolute; top: 20px; left: 20px; background: rgba(30, 41, 59, 0.9); padding: 15px; border-radius: 8px; border: 1px solid #475569; pointer-events: none; }}
        .legend-item {{ display: flex; align-items: center; margin-bottom: 8px; font-size: 14px; }}
        .color-box {{ width: 16px; height: 16px; margin-right: 10px; border-radius: 4px; }}
    </style>
</head>
<body>
    <div id="mynetwork"></div>
    <div class="legend">
        <h3>Architecture Map</h3>
        <div class="legend-item"><div class="color-box" style="background: #fb7e81"></div>Endpoints (API)</div>
        <div class="legend-item"><div class="color-box" style="background: #7be141"></div>Database Models</div>
        <div class="legend-item"><div class="color-box" style="background: #ffcf00"></div>Services/Modules</div>
        <div class="legend-item"><div class="color-box" style="background: #97c2fc"></div>Other</div>
    </div>

    <script type="text/javascript">
        // Data from Eonix Extraction
        var nodes = new vis.DataSet({nodes_json});
        var edges = new vis.DataSet({edges_json});

        var container = document.getElementById('mynetwork');
        var data = {{
            nodes: nodes,
            edges: edges
        }};
        var options = {{
            nodes: {{
                shape: 'dot',
                size: 20,
                font: {{ color: '#ffffff' }},
                borderWidth: 2
            }},
            edges: {{
                width: 2,
                color: {{ color: '#64748b' }},
                arrows: 'to',
                smooth: {{ type: 'cubicBezier' }}
            }},
            physics: {{
                forceAtlas2Based: {{
                    gravitationalConstant: -50,
                    centralGravity: 0.01,
                    springLength: 100,
                    springConstant: 0.08
                }},
                maxVelocity: 50,
                solver: 'forceAtlas2Based',
                timestep: 0.35,
                stabilization: {{ iterations: 150 }}
            }}
        }};
        var network = new vis.Network(container, data, options);
    </script>
</body>
</html>
"""

if __name__ == "__main__":
    asyncio.run(generate_visualization())
