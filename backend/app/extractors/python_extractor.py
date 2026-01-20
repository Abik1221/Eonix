"""
Enhanced Python AST extractor for comprehensive code analysis.
Extracts endpoints, database models, Redis usage, external API calls, and more.

NO AI. Pure AST parsing for HIGH confidence results.
"""

import ast
from typing import List, Optional, Dict, Any
from app.extractors.base import BaseExtractor
from app.schemas.uas import (
    ExtractionResult, EndpointNode, ServiceNode, DatabaseModelNode,
    DependencyEdge, CacheNode, ExternalAPINode, Parameter
)


class PythonExtractor(BaseExtractor):
    """
    Enhanced Python extractor using AST module.
    
    Extracts:
    - FastAPI/Flask endpoints with parameters and response types
    - SQLAlchemy/Django/Pydantic models
    - Redis/cache usage
    - External API calls (httpx, requests)
    - Database connections
    """
    
    def extract(self, file_path: str, content: str) -> ExtractionResult:
        nodes = []
        edges = []
        
        try:
            tree = ast.parse(content)
        except SyntaxError:
            # Return empty result for files with syntax errors
            return ExtractionResult(nodes=[], edges=[], confidence="LOW")

        # Track imports for context
        imports = self._extract_imports(tree)
        
        # Detect service/file role
        service_name = self._infer_service_name(file_path, imports)
        
        # Walk the AST and extract different components
        for node in ast.walk(tree):
            # 1. Extract API Endpoints
            if isinstance(node, ast.FunctionDef):
                endpoint = self._extract_endpoint(node, file_path, imports)
                if endpoint:
                    nodes.append(endpoint)
                
                # Check for external API calls within function
                external_calls = self._extract_external_calls(node, file_path)
                nodes.extend(external_calls)
                edges.extend(self._create_external_edges(external_calls, service_name))
            
            # 2. Extract Database Models
            if isinstance(node, ast.ClassDef):
                model = self._extract_database_model(node, file_path)
                if model:
                    nodes.append(model)
                
            # 3. Extract Redis/Cache usage
            if isinstance(node, ast.Assign) or isinstance(node, ast.Call):
                cache_node = self._extract_cache_usage(node, file_path)
                if cache_node:
                    nodes.append(cache_node)
        
        return ExtractionResult(
            nodes=nodes,
            edges=edges,
            confidence="HIGH"  # AST parsing is deterministic
        )
    
    def _extract_imports(self, tree: ast.AST) -> Dict[str, str]:
        """Extract all imports to understand context"""
        imports = {}
        
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    imports[alias.asname or alias.name] = alias.name
            
            elif isinstance(node, ast.ImportFrom):
                module = node.module or ""
                for alias in node.names:
                    key = alias.asname or alias.name
                    imports[key] = f"{module}.{alias.name}"
        
        return imports
    
    def _infer_service_name(self, file_path: str, imports: Dict[str, str]) -> str:
        """Infer service name from file path or imports"""
        # Simple heuristic: use directory name or "python-service"
        parts = file_path.split('/')
        if len(parts) > 2:
            return parts[-2]  # Parent directory
        return "python-service"
    
    def _extract_endpoint(
        self,
        node: ast.FunctionDef,
        file_path: str,
        imports: Dict[str, str]
    ) -> Optional[EndpointNode]:
        """
        Extract FastAPI/Flask endpoint from function with decorator.
        
        Patterns:
        @app.get("/users/{user_id}")
        @router.post("/items", response_model=ItemResponse)
        async def get_user(user_id: int, q: str = Query(...)):
            pass
        """
        for decorator in node.decorator_list:
            # FastAPI/Flask pattern: @app.get("/path")
            if isinstance(decorator, ast.Call) and hasattr(decorator.func, 'attr'):
                method_name = decorator.func.attr
                
                if method_name.lower() in ['get', 'post', 'put', 'delete', 'patch', 'head', 'options']:
                    method = method_name.upper()
                    path = "unknown"
                    response_type = None
                    
                    # Extract path from first argument
                    if decorator.args and isinstance(decorator.args[0], ast.Constant):
                        path = decorator.args[0].value
                    
                    # Extract response_model from keyword args
                    for keyword in decorator.keywords:
                        if keyword.arg == "response_model":
                            response_type = self._extract_type_name(keyword.value)
                    
                    # Extract parameters from function signature
                    parameters = self._extract_function_parameters(node)
                    
                    # Extract return type annotation
                    if not response_type and node.returns:
                        response_type = self._extract_type_name(node.returns)
                    
                    endpoint_id = f"{file_path}:{node.name}:{node.lineno}"
                    
                    return EndpointNode(
                        id=endpoint_id,
                        name=node.name,
                        file_path=file_path,
                        line_number=node.lineno,
                        method=method,
                        path=path,
                        parameters=parameters,
                        response_type=response_type,
                        metadata={
                            "framework": "FastAPI/Flask",
                            "is_async": isinstance(node, ast.AsyncFunctionDef) or \
                                       any(isinstance(d, ast.Name) and d.id == 'async' 
                                           for d in node.decorator_list)
                        },
                        confidence="HIGH"
                    )
        
        return None
    
    def _extract_function_parameters(self, func_node: ast.FunctionDef) -> List[Parameter]:
        """Extract function parameters with types"""
        parameters = []
        
        for arg in func_node.args.args:
            # Skip 'self' and 'cls'
            if arg.arg in ['self', 'cls']:
                continue
            
            param_type = None
            if arg.annotation:
                param_type = self._extract_type_name(arg.annotation)
            
            # Determine parameter source (path, query, body)
            source = self._infer_parameter_source(arg, func_node)
            
            parameters.append(Parameter(
                name=arg.arg,
                type=param_type or "Any",
                source=source,
                required=True  # Default, could be refined
            ))
        
        return parameters
    
    def _infer_parameter_source(self, arg: ast.arg, func_node: ast.FunctionDef) -> str:
        """Infer if parameter is from path, query, or body"""
        # Check for FastAPI dependency injections
        for decorator in func_node.decorator_list:
            if isinstance(decorator, ast.Call):
                for kw in decorator.keywords:
                    if kw.arg == "path" and arg.arg in str(kw.value):
                        return "path"
        
        # heuristic: if parameter has type annotation 'Body' or 'Query', use that
        if arg.annotation:
            type_name = self._extract_type_name(arg.annotation)
            if "Query" in type_name:
                return "query"
            if "Body" in type_name:
                return "body"
            if "Path" in type_name:
                return "path"
        
        # Default to query for simple types, body for complex
        return "query"
    
    def _extract_type_name(self, annotation) -> str:
        """Extract type name from annotation node"""
        if isinstance(annotation, ast.Name):
            return annotation.id
        elif isinstance(annotation, ast.Constant):
            return str(annotation.value)
        elif isinstance(annotation, ast.Subscript):
            # Handle List[str], Optional[int], etc.
            base = self._extract_type_name(annotation.value)
            return f"{base}[...]"
        elif isinstance(annotation, ast.Attribute):
            return annotation.attr
        else:
            return "Unknown"
    
    def _extract_database_model(
        self,
        node: ast.ClassDef,
        file_path: str
    ) -> Optional[DatabaseModelNode]:
        """
        Extract SQLAlchemy/Django/Pydantic models.
        
        Patterns:
        class User(Base):
            __tablename__ = "users"
            id = Column(Integer, primary_key=True)
            email = Column(String)
        """
        is_model = False
        table_name = node.name.lower()
        framework = None
        columns = []
        
        # Check base classes
        for base in node.bases:
            base_name = None
            if isinstance(base, ast.Name):
                base_name = base.id
            elif isinstance(base, ast.Attribute):
                base_name = base.attr
            
            if base_name in ['Base', 'DeclarativeBase']:  # SQLAlchemy
                is_model = True
                framework = "SQLAlchemy"
            elif base_name == 'Model':  # Django or SQLAlchemy
                is_model = True
                framework = "Django/SQLAlchemy"
            elif base_name == 'BaseModel':  # Pydantic (data model, not DB)
                # Could be Pydantic schema, treat carefully
                is_model = True
                framework = "Pydantic"
        
        if not is_model:
            return None
        
        # Extract __tablename__ if present
        for item in node.body:
            if isinstance(item, ast.Assign):
                for target in item.targets:
                    if isinstance(target, ast.Name) and target.id == '__tablename__':
                        if isinstance(item.value, ast.Constant):
                            table_name = item.value.value
        
        # Extract columns
        for item in node.body:
            if isinstance(item, ast.Assign):
                for target in item.targets:
                    if isinstance(target, ast.Name):
                        column_name = target.id
                        if column_name not in ['__tablename__', '__table_args__']:
                            column_type = self._extract_column_type(item.value)
                            if column_type:
                                columns.append(f"{column_name}:{column_type}")
        
        model_id = f"{file_path}:{node.name}:{node.lineno}"
        
        return DatabaseModelNode(
            id=model_id,
            name=node.name,
            file_path=file_path,
            line_number=node.lineno,
            table_name=table_name,
            columns=columns,
            metadata={"framework": framework},
            confidence="HIGH"
        )
    
    def _extract_column_type(self, value_node) -> Optional[str]:
        """Extract column type from Column() call"""
        if isinstance(value_node, ast.Call):
            if hasattr(value_node.func, 'id') and value_node.func.id == 'Column':
                # First argument is usually the type
                if value_node.args:
                    return self._extract_type_name(value_node.args[0])
            elif hasattr(value_node.func, 'attr') and value_node.func.attr == 'Column':
                if value_node.args:
                    return self._extract_type_name(value_node.args[0])
        return None
    
    def _extract_cache_usage(
        self,
        node,
        file_path: str
    ) -> Optional[CacheNode]:
        """
        Detect Redis/cache usage.
        
        Patterns:
        redis_client = redis.Redis(host="localhost")
        cache.set("key", value, ttl=3600)
        """
        # Check for Redis client instantiation
        if isinstance(node, ast.Assign):
            if isinstance(node.value, ast.Call):
                func = node.value.func
                if hasattr(func, 'attr') and func.attr in ['Redis', 'StrictRedis']:
                    # Extract connection details
                    host = None
                    port = None
                    ttl = None
                    
                    for keyword in node.value.keywords:
                        if keyword.arg == 'host' and isinstance(keyword.value, ast.Constant):
                            host = keyword.value.value
                        if keyword.arg == 'port' and isinstance(keyword.value, ast.Constant):
                            port = keyword.value.value
                    
                    cache_id = f"{file_path}:redis:{node.lineno}"
                    
                    return CacheNode(
                        id=cache_id,
                        name="Redis",
                        file_path=file_path,
                        line_number=node.lineno,
                        technology="Redis",
                        host=host,
                        port=port,
                        ttl=ttl,
                        metadata={},
                        confidence="HIGH"
                    )
        
        return None
    
    def _extract_external_calls(
        self,
        func_node: ast.FunctionDef,
        file_path: str
    ) -> List[ExternalAPINode]:
        """
        Extract external API calls using httpx, requests, etc.
        
        Patterns:
        response = httpx.get("https://api.stripe.com/v1/charges")
        response = requests.post("https://api.sendgrid.com/v3/mail")
        """
        external_apis = []
        
        for node in ast.walk(func_node):
            if isinstance(node, ast.Call):
                # Check if it's an HTTP call
                if hasattr(node.func, 'attr'):
                    method = node.func.attr
                    if method.lower() in ['get', 'post', 'put', 'delete', 'patch']:
                        # Check if it's httpx or requests
                        if hasattr(node.func.value, 'id'):
                            lib = node.func.value.id
                            if lib in ['httpx', 'requests']:
                                # Extract URL
                                url = None
                                if node.args and isinstance(node.args[0], ast.Constant):
                                    url = node.args[0].value
                                
                                if url and url.startswith('http'):
                                    # Infer provider from URL
                                    provider = self._infer_provider_from_url(url)
                                    
                                    api_id = f"{file_path}:external:{provider}:{func_node.lineno}"
                                    
                                    external_apis.append(ExternalAPINode(
                                        id=api_id,
                                        name=provider,
                                        file_path=file_path,
                                        line_number=func_node.lineno,
                                        provider=provider,
                                        base_url=url,
                                        endpoints_called=[url],
                                        metadata={"method": method.upper(), "library": lib},
                                        confidence="HIGH"
                                    ))
        
        return external_apis
    
    def _create_external_edges(
        self,
        external_apis: List[ExternalAPINode],
        service_name: str
    ) -> List[DependencyEdge]:
        """Create edges for external API calls"""
        edges = []
        
        for api in external_apis:
            edges.append(DependencyEdge(
                source_id=service_name,
                target_id=api.id,
                type="CALLS_EXTERNAL",
                metadata={"provider": api.provider}
            ))
        
        return edges
    
    def _infer_provider_from_url(self, url: str) -> str:
        """Infer API provider from URL"""
        if 'stripe.com' in url:
            return 'Stripe'
        elif 'sendgrid.com' in url:
            return 'SendGrid'
        elif 'twilio.com' in url:
            return 'Twilio'
        elif 'github.com' in url or 'api.github.com' in url:
            return 'GitHub'
        elif 'googleapis.com' in url:
            return 'Google'
        else:
            # Extract domain
            from urllib.parse import urlparse
            try:
                domain = urlparse(url).netloc
                return domain
            except:
                return 'Unknown'
