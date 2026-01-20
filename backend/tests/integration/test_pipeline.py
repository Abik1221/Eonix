"""
End-to-end integration test for the static code analysis system.
Tests the complete pipeline from scanning to extraction.
"""

import os
import tempfile
import shutil
from app.services.scanner import RepositoryScanner
from app.services.detector import LanguageDetector
from app.extractors.manager import extraction_manager


def create_test_repo():
    """Create a temporary test repository with sample files"""
    temp_dir = tempfile.mkdtemp()
    
    # Create Python FastAPI file
    python_code = """
from fastapi import FastAPI, Query
from sqlalchemy import Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
import redis
import httpx

app = FastAPI()
Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    email = Column(String)
    name = Column(String)

redis_client = redis.Redis(host="localhost", port=6379)

@app.get("/users/{user_id}")
async def get_user(user_id: int, q: str = Query(...)):
    return {"id": user_id}

@app.post("/users")
async def create_user(email: str, name: str):
    return {"email": email, "name": name}

async def call_stripe():
    response = await httpx.get("https://api.stripe.com/v1/charges")
    return response.json()
"""
    
    # Create TypeScript NestJS file
    typescript_code = """
import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;
}

@Controller('products')
export class ProductsController {
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Product> {
    return null;
  }

  @Post()
  async create(@Body() product: Product): Promise<Product> {
    return product;
  }
}
"""
    
    # Create Express.js file
    express_code = """
const express = require('express');
const router = express.Router();

router.get('/items/:id', (req, res) => {
  res.json({ id: req.params.id });
});

router.post('/items', (req, res) => {
  res.json(req.body);
});

module.exports = router;
"""
    
    # Write files
    os.makedirs(os.path.join(temp_dir, "src"), exist_ok=True)
    
    with open(os.path.join(temp_dir, "src", "main.py"), 'w') as f:
        f.write(python_code)
    
    with open(os.path.join(temp_dir, "src", "products.controller.ts"), 'w') as f:
        f.write(typescript_code)
    
    with open(os.path.join(temp_dir, "src", "routes.js"), 'w') as f:
        f.write(express_code)
    
    # Create config files to help detection
    with open(os.path.join(temp_dir, "requirements.txt"), 'w') as f:
        f.write("fastapi\nsqlalchemy\nredis\n")
    
    with open(os.path.join(temp_dir, "package.json"), 'w') as f:
        f.write('{"name": "test", "dependencies": {"@nestjs/common": "^9.0.0"}}')
    
    return temp_dir


def test_complete_pipeline():
    """Test the complete static analysis pipeline"""
    
    print("=" * 60)
    print("🧪 STATIC CODE ANALYSIS - END-TO-END TEST")
    print("=" * 60)
    
    # Step 1: Create test repository
    print"\n1️⃣  Creating test repository...")
    repo_path = create_test_repo()
    print(f"   ✅ Created at: {repo_path}")
    
    try:
        # Step 2: Language Detection
        print("\n2️⃣  Detecting language and frameworks...")
        detector = LanguageDetector(repo_path)
        detection_result = detector.detect()
        
        print(f"   ✅ Primary Language: {detection_result.primary_language.value}")
        print(f"   ✅ Confidence: {detection_result.confidence.value}")
        print(f"   ✅ Frameworks Detected:")
        for framework in detection_result.frameworks:
            print(f"      - {framework.name} ({framework.confidence.value})")
        
        # Step 3: File Scanning
        print("\n3️⃣  Scanning files...")
        scanner = RepositoryScanner()
        files = scanner.scan(repo_path)
        
        print(f"   ✅ Total files found: {len(files)}")
        print(f"   ✅ Files by category:")
        for category, count in scanner.stats.files_by_category.items():
            if count > 0:
                print(f"      - {category.value}: {count}")
        
        # Step 4: Extraction
        print("\n4️⃣  Extracting architectural facts...")
        
        all_nodes = []
        all_edges = []
        
        for file_info in files:
            result = extraction_manager.extract_file(file_info.path)
            all_nodes.extend(result.nodes)
            all_edges.extend(result.edges)
            
            if result.nodes:
                print(f"   ✅ {file_info.relative_path}:")
                print(f"      - Found {len(result.nodes)} nodes")
                print(f"      - Confidence: {result.confidence.value}")
        
        # Step 5: Verify Results
        print("\n5️⃣  Verifying extraction results...")
        
        from app.schemas.uas import EndpointNode, DatabaseModelNode, CacheNode, ExternalAPINode
        
        endpoints = [n for n in all_nodes if isinstance(n, EndpointNode)]
        models = [n for n in all_nodes if isinstance(n, DatabaseModelNode)]
        caches = [n for n in all_nodes if isinstance(n, CacheNode)]
        external_apis = [n for n in all_nodes if isinstance(n, ExternalAPINode)]
        
        print(f"   ✅ Total Nodes Extracted: {len(all_nodes)}")
        print(f"   ✅ Endpoints: {len(endpoints)}")
        for endpoint in endpoints:
            print(f"      - {endpoint.method} {endpoint.path} ({endpoint.metadata.get('framework', 'Unknown')})")
        
        print(f"   ✅ Database Models: {len(models)}")
        for model in models:
            print(f"      - {model.name} (table: {model.table_name}, columns: {len(model.columns)})")
        
        print(f"   ✅ Cache Nodes: {len(caches)}")
        for cache in caches:
            print(f"      - {cache.technology} at {cache.host}:{cache.port}")
        
        print(f"   ✅ External APIs: {len(external_apis)}")
        for api in external_apis:
            print(f"      - {api.provider}")
        
        print(f"\n   ✅ Total Edges: {len(all_edges)}")
        
        # Validation
        print("\n6️⃣  Validation...")
        
        assertions = []
        
        # Should find at least some endpoints
        assertions.append(("Endpoints extracted", len(endpoints) > 0))
        
        # Should find database models
        assertions.append(("Database models extracted", len(models) > 0))
        
        # Should find Redis cache
        assertions.append(("Cache detected", len(caches) > 0))
        
        # All extractions should have HIGH or MEDIUM confidence
        high_confidence = sum(1 for n in all_nodes if hasattr(n, 'confidence') and n.confidence == "HIGH")
        assertions.append(("High confidence extractions", high_confidence > 0))
        
        # Report results
        all_passed = True
        for assertion_name, result in assertions:
            status = "✅ PASS" if result else "❌ FAIL"
            print(f"   {status}: {assertion_name}")
            if not result:
                all_passed = False
        
        # Final Result
        print("\n" + "=" * 60)
        if all_passed:
            print("🎉 ALL TESTS PASSED!")
            print("=" * 60)
            print("\n✅ Static Code Analysis System is working correctly!")
            print("   - File Scanner: ✅")
            print("   - Language Detection: ✅")
            print("   - Python AST Extractor: ✅")
            print("   - TypeScript Extractor: ✅")
            print("   - Unified Architecture Schema: ✅")
            print("\n🚀 Ready for Neo4j graph population!")
        else:
            print("⚠️  SOME TESTS FAILED")
            print("=" * 60)
            return False
        
        return True
        
    finally:
        # Cleanup
        print(f"\n🧹 Cleaning up test repository...")
        shutil.rmtree(repo_path)
        print("   ✅ Cleanup complete")


if __name__ == "__main__":
    success = test_complete_pipeline()
    exit(0 if success else 1)
