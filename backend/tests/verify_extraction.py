import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app.extractors.manager import extraction_manager

def run_test():
    # Test TypeScript
    target_file = "tests/dummy_api.ts"
    if not os.path.exists(target_file):
        target_file = "backend/tests/dummy_api.ts"
        
    print(f"Extracting {target_file}...")
    
    # We need to ensure we pass absolute path or relative from cwd correctly if the extractor opens it.
    # The manager opens the file.
    
    result = extraction_manager.extract_file(target_file)
    
    if result:
        print(f"Found {len(result.nodes)} nodes.")
        for node in result.nodes:
            print(f" - [{node.type}] {node.name} (Line {node.line_number})")
            if node.type == "DatabaseModel":
                print(f"   -> Table: {node.table_name}")
            if node.type == "Endpoint":
                print(f"   -> Method: {node.method}, Path: {node.path}")
    else:
        print("No result found.")

if __name__ == "__main__":
    run_test()
