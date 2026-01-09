import re
from app.extractors.base import BaseExtractor
from app.schemas.uas import ExtractionResult, EndpointNode, DatabaseModelNode

class TSExtractor(BaseExtractor):
    def extract(self, file_path: str, content: str) -> ExtractionResult:
        nodes = []
        edges = []
        
        # Regex Patterns for minimal MVP extraction
        
        # 1. NestJS Controllers or Express Routes (Heuristic)
        # @Get('/users') or router.get('/users', ...)
        # Capture method and path
        endpoint_pattern = re.compile(r"@(Get|Post|Put|Delete|Patch)\s*\(\s*['\"]([^'\"]*)['\"]\s*\)", re.IGNORECASE)
        
        # 2. Classes (Potential Models)
        # export class UserModel ...
        class_pattern = re.compile(r"export\s+class\s+(\w+)", re.IGNORECASE)
        
        # Scan for endpoints
        for match in endpoint_pattern.finditer(content):
            method = match.group(1).upper()
            path = match.group(2)
            # Find the function name - simplistic lookahead or assume it follows
            # This is hard with regex, so we'll just create a node for the route
            name = f"{method} {path}" 
            
            nodes.append(EndpointNode(
                id=f"{file_path}:{method}:{path}",
                name=name,
                file_path=file_path,
                line_number=content.count('\n', 0, match.start()) + 1,
                method=method,
                path=path,
                metadata={"framework": "NestJS/Express (Heuristic)"}
            ))

        # Scan for models/classes
        for match in class_pattern.finditer(content):
            class_name = match.group(1)
            # Filter naive common names if needed
            is_model = "Model" in class_name or "Entity" in class_name or "Dto" in class_name
            
            if is_model:
                nodes.append(DatabaseModelNode(
                    id=f"{file_path}:{class_name}",
                    name=class_name,
                    file_path=file_path,
                    line_number=content.count('\n', 0, match.start()) + 1,
                    table_name=class_name.lower(),
                    metadata={"language": "typescript"}
                ))
                
        return ExtractionResult(nodes=nodes, edges=edges)
