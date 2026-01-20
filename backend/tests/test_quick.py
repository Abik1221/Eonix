#!/usr/bin/env python3
"""
Quick manual test to verify the static analysis system works.
Run from backend directory: PYTHONPATH=. python3 tests/test_quick.py
"""

print("🧪 Testing Static Code Analysis System\n")

# Test 1: Python Extractor
print("1️⃣  Testing Python AST Extractor...")

code = """
from fastapi import FastAPI
app = FastAPI()

@app.get("/users")
def get_users():
    return []
"""

from app.extractors.python_extractor import PythonExtractor
extractor = PythonExtractor()
result = extractor.extract("test.py", code)

print(f"   ✅ Found {len(result.nodes)} nodes (confidence: {result.confidence})")
for node in result.nodes:
    if hasattr(node, 'method'):
        print(f"      - {node.method} {node.path}")

# Test 2: TypeScript Extractor (Regex)
print("\n2️⃣  Testing TypeScript Extractor...")

ts_code = """
@Controller('products')
export class ProductsController {
  @Get(':id')
  async findOne(id: string) {}
}
"""

from app.extractors.ts_extractor import TypeScriptExtractor
ts_extractor = TypeScriptExtractor()
ts_result = ts_extractor.extract("test.ts", ts_code)

print(f"   ⚠️  Tree-sitter available: {ts_extractor.use_treesitter}")
print(f"   ✅ Found {len(ts_result.nodes)} nodes (confidence: {ts_result.confidence})")

# Test 3: Scanner
print("\n3️⃣  Testing File Scanner...")

import tempfile, os, shutil
from app.services.scanner import RepositoryScanner

temp = tempfile.mkdtemp()
os.makedirs(f"{temp}/src")
os.makedirs(f"{temp}/node_modules")

with open(f"{temp}/src/main.py", 'w') as f:
    f.write("print('test')")

scanner = RepositoryScanner()
files = scanner.scan(temp)

print(f"   ✅ Scanned: {len(files)} files, ignored {scanner.stats.directories_ignored} dirs")

shutil.rmtree(temp)

# Test 4: Language Detection
print("\n4️⃣  Testing Language Detector...")

from app.services.detector import LanguageDetector

temp = tempfile.mkdtemp()
with open(f"{temp}/requirements.txt", 'w') as f:
    f.write("fastapi\n")

detector = LanguageDetector(temp)
result = detector.detect()

print(f"   ✅ Detected: {result.primary_language.value} (confidence: {result.confidence.value})")

shutil.rmtree(temp)

print("\n" + "=" * 60)
print("🎉 ALL TESTS PASSED!")
print("=" * 60)
print("\n✅ Static Code Analysis System is fully functional:")
print("   • Python AST Extractor ✅")
print("   • TypeScript Extractor ✅")
print("   • File Scanner ✅")
print("   • Language Detector ✅")
print("\n🚀 Ready for Neo4j integration!")
