from tree_sitter import Language
import os

def build():
    # Paths
    base_dir = os.path.dirname(os.path.dirname(__file__))
    vendor_dir = os.path.join(base_dir, "vendor")
    build_dir = os.path.join(base_dir, "build")
    
    if not os.path.exists(build_dir):
        os.makedirs(build_dir)
        
    output_path = os.path.join(build_dir, "my-languages.so")
    
    # We need both typescript and tsx
    ts_path = os.path.join(vendor_dir, "tree-sitter-typescript", "typescript")
    tsx_path = os.path.join(vendor_dir, "tree-sitter-typescript", "tsx")
    
    print(f"Building languages to {output_path}...")
    print(f"Using: {ts_path}")
    print(f"Using: {tsx_path}")

    Language.build_library(
        output_path,
        [ts_path, tsx_path]
    )
    print("Build complete.")

if __name__ == "__main__":
    build()
