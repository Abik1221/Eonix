#!/bin/bash
# Build script for Java and Go extractors

set -e

echo "🔨 Building Static Code Extractors"
echo "=================================="

# Build Java Extractor
echo ""
echo "1️⃣  Building Java Extractor..."
if command -v mvn &> /dev/null; then
    cd vendor/java-extractor
    mvn clean package -q
    if [ -f "target/java-extractor.jar" ]; then
        echo "   ✅ Java extractor built successfully"
    else
        echo "   ❌ Java extractor build failed"
        exit 1
    fi
    cd ../..
else
    echo "   ⚠️  Maven not installed, skipping Java extractor"
fi

# Build Go Extractor
echo ""
echo "2️⃣  Building Go Extractor..."
if command -v go &> /dev/null; then
    cd vendor/go-extractor
    go build -o go-extractor main.go
    if [ -f "go-extractor" ]; then
        echo "   ✅ Go extractor built successfully"
    else
        echo "   ❌ Go extractor build failed"
        exit 1
    fi
    cd ../..
else
    echo "   ⚠️  Go not installed, skipping Go extractor"
fi

echo ""
echo "🎉 Build complete!"
echo ""
echo "Extractors available:"
echo "  - Python (built-in AST) ✅"
echo "  - TypeScript/JavaScript (tree-sitter) ✅"
[ -f "vendor/java-extractor/target/java-extractor.jar" ] && echo "  - Java (JavaParser) ✅" || echo "  - Java (JavaParser) ⚠️  not built"
[ -f "vendor/go-extractor/go-extractor" ] && echo "  - Go (go/parser) ✅" || echo "  - Go (go/parser) ⚠️  not built"
