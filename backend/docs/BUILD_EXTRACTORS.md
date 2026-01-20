# Build Instructions for Extractors

## Overview

Eonix uses native AST parsers for each language to ensure HIGH confidence extraction:

- **Python**: Built-in `ast` module (no build needed)
- **TypeScript/JavaScript**: Tree-sitter (Python bindings)
- **Java**: JavaParser (standalone JAR)
- **Go**: go/parser (standalone binary)

---

## Quick Start

```bash
cd backend
./scripts/build_extractors.sh
```

This will build both Java and Go extractors if Maven and Go are installed.

---

## Manual Build Instructions

### Java Extractor (JavaParser)

**Requirements**: Java 11+ and Maven

```bash
cd backend/vendor/java-extractor
mvn clean package
```

**Output**: `target/java-extractor.jar`

**Test**:
```bash
java -jar target/java-extractor.jar /path/to/SomeController.java
```

**What it extracts**:
- Spring Boot `@RestController` endpoints
- `@GetMapping`, `@PostMapping`, etc.
- JPA `@Entity` classes
- Request/Response parameters

---

### Go Extractor (go/parser)

**Requirements**: Go 1.16+

```bash
cd backend/vendor/go-extractor
go build -o go-extractor main.go
```

**Output**: `go-extractor` binary

**Test**:
```bash
./go-extractor /path/to/handlers.go
```

**What it extracts**:
- HTTP handlers (`http.HandleFunc`, Gin routes)
- GORM models
- gRPC services

---

## Verification

Check which extractors are available:

```bash
cd backend
python3 -c "
from app.extractors.manager import extraction_manager
for ext, extractor in extraction_manager.extractors.items():
    print(f'{ext}: {extractor.__class__.__name__}')
"
```

---

## Troubleshooting

### Java Extractor

**Error**: `java.lang.ClassNotFoundException`
- **Solution**: Rebuild with `mvn clean package`

**Error**: `JAR not found`
- **Solution**: Check `vendor/java-extractor/target/java-extractor.jar` exists

### Go Extractor

**Error**: `binary not found`
- **Solution**: Build with `go build -o go-extractor main.go`

**Error**: `permission denied`
- **Solution**: `chmod +x vendor/go-extractor/go-extractor`

---

## Development

### Adding New Patterns

**Java** (`vendor/java-extractor/src/main/java/com/eonix/extractor/JavaExtractor.java`):
- Modify `extractSpringEndpoints()` or `extractJPAEntities()`
- Rebuild with Maven

**Go** (`vendor/go-extractor/main.go`):
- Modify `extractHTTPHandlers()` or `extractGORMModels()`
- Rebuild with `go build`

### Testing

Create sample files and test extraction:

**Java**:
```bash
echo '@RestController public class Test { @GetMapping("/test") public void test() {} }' > Test.java
java -jar vendor/java-extractor/target/java-extractor.jar Test.java
```

**Go**:
```bash
echo 'package main; func main() { http.HandleFunc("/test", handler) }' > test.go
./vendor/go-extractor/go-extractor test.go
```

---

## CI/CD Integration

Add to your CI pipeline:

```yaml
# .github/workflows/build.yml
jobs:
  build:
    - name: Build Extractors
      run: |
        cd backend
        ./scripts/build_extractors.sh
```

---

## Performance

**Java Extractor**: ~100-200ms per file  
**Go Extractor**: ~50-100ms per file  
**Python Extractor**: ~20-50ms per file (no subprocess overhead)  
**TypeScript Extractor**: ~30-80ms per file (tree-sitter)

All extractors run in parallel when processing repositories.
