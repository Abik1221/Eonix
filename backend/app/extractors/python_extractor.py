import ast
from typing import List
from app.extractors.base import BaseExtractor
from app.schemas.uas import ExtractionResult, EndpointNode, ServiceNode, DatabaseModelNode, DependencyEdge

class PythonExtractor(BaseExtractor):
    def extract(self, file_path: str, content: str) -> ExtractionResult:
        nodes = []
        edges = []
        
        try:
            tree = ast.parse(content)
        except SyntaxError:
            return ExtractionResult(nodes=[], edges=[])

        # Walk the AST
        for node in ast.walk(tree):
            # Detect FastAPI/Flask Endpoints
            if isinstance(node, ast.FunctionDef):
                for decorator in node.decorator_list:
                    if isinstance(decorator, ast.Call) and hasattr(decorator.func, 'attr'):
                        if decorator.func.attr in ['get', 'post', 'put', 'delete', 'patch']:
                            # Heuristic: It's an endpoint
                            method = decorator.func.attr.upper()
                            path = "unknown"
                            if decorator.args:
                                if isinstance(decorator.args[0], ast.Constant):
                                    path = decorator.args[0].value
                            
                            endpoint_id = f"{file_path}:{node.name}"
                            nodes.append(EndpointNode(
                                id=endpoint_id,
                                name=node.name,
                                file_path=file_path,
                                line_number=node.lineno,
                                method=method,
                                path=path,
                                metadata={"framework": "FastAPI/Flask"}
                            ))

            # Detect SQLAlchemy/Django Models
            if isinstance(node, ast.ClassDef):
                is_model = False
                for base in node.bases:
                    if hasattr(base, 'attr') and base.attr == 'Base': # SQLAlchemy
                        is_model = True
                    if hasattr(base, 'attr') and base.attr == 'Model': # Django
                        is_model = True
                    if isinstance(base, ast.Name) and base.id == "BaseModel": # Pydantic
                        is_model = True # Treat as data model
                
                if is_model:
                    nodes.append(DatabaseModelNode(
                        id=f"{file_path}:{node.name}",
                        name=node.name,
                        file_path=file_path,
                        line_number=node.lineno,
                        table_name=node.name.lower(), # Guess
                        metadata={"framework": "ORM"}
                    ))
        
        return ExtractionResult(nodes=nodes, edges=edges)
