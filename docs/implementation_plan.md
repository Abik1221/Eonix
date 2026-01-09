# Architecture & Implementation Plan: Semantic Repository Mapping Platform

## 1. Executive Summary
This document outlines the technical implementation for a next-generation Repository Mapping Platform. Unlike traditional documentation tools, this system builds a live, queryable semantic graph of software architecture by combining deterministic static analysis with probabilistic AI reasoning.

**Core Value Proposition**: transforming "dead" code into a "living" architectural map that answers questions about structure, flow, contracts, and infrastructure.

---

### 2.1 The Pipeline-Based Intelligence System
**Core Philosophy: "Build, Draw, Explain"**

*   **Your system does not use AI to discover or draw endpoints or microservices.**
*   Instead, your system first performs **deterministic static analysis** on the repository to extract facts such as API endpoints, services, gateways, databases, caches, and inter-service calls.
*   These extracted facts are then stored in a single **architecture graph**, which becomes the **only source of truth** for the system.
*   All endpoint mappings and microservice diagrams are generated directly from this architecture graph, using normal **visualization logic**, not AI.
*   **The AI is used only after the diagrams exist**: to explain what the diagrams mean, summarize complex relationships, label important services, highlight risks, and guide human understanding.
*   **Invariant**: The system builds the architecture, the UI draws it, and the AI explains it—**the AI never guesses, discovers, or draws anything on its own.**

#### Phase 1: Deterministic Extraction (The "Truth" Layer)
This layer uses compilers and parsers, **never AI**, to guarantee accurate facts.

#### Phase 2: The Semantic Graph (The "Model" Layer)
A strict Graph Database (Neo4j) representing the "Ground Truth" of the architecture.

#### Phase 3: The Analyst (The "Insight" Layer)
A directed **LangGraph** pipeline that reasons over the graph to answer "Why" and "How", without hallucinating new components.

#### Layer 1: Structural Map (The "Skeleton")
*   **Goal**: Identify boundaries and modules.
*   **Extraction Targets**: Directories, Monorepo packages (workspaces), Entry points (`main.go`, `index.js`), Class/Module hierarchies.
*   **Normalization**: Code is mapped to `Module`, `Package`, and `Component` nodes.

#### Layer 2: Application Logic Map (The "Organs")
*   **Goal**: Understand internal flow.
*   **Extraction Targets**: Controllers, Service Classes, DAO/Repositories, Domain Entities.
*   **Normalization**:
    *   `Controller` handles `Route`.
    *   `Service` implements `BusinessLogic`.
    *   `Repository` accesses `DataStore`.

#### Layer 3: Contract Map (The "Nervous System")
*   **Goal**: Map communication protocols.
*   **Extraction Targets**:
    *   **API**: OpenAPI specs, GraphQL schemas, gRPC Protobufs.
    *   **Events**: Kafka topics, RabbitMQ exchanges (producers/consumers).
    *   **DB**: SQL Schemas (DDL), ORM Models (Prisma, TypeORM, Hibernate).
    *   **External**: 3rd party API SDK usage (Stripe, Twilio).

#### Layer 4: Infrastructure & Performance Map (The "Hardware")
*   **Goal**: Map operational characteristics.
*   **Extraction Targets**: Dockerfiles, Kubernetes manifests, Terraform/HCL, CI/CD pipelines.
*   **Attributes**: `RateLimit` policies, `CacheTTL` configurations, `CircuitBreaker` thresholds, `Database` connection pools.

---

---

## 3. Detailed Processing Pipeline (Step-by-Step)

### 3.1 Step 1: Repository Ingestion (FastAPI)
*   **Mechanism**: Manual / OAuth (No AI).
*   **Actions**:
    *   Clone Repository.
    *   **Detector**: Identify Languages (e.g., `pom.xml` -> Java, `package.json` -> Node), Frameworks, and Architecture Type (Monolith vs. Microservice).

### 3.2 Step 2: Static Extractors (Deterministic)
*   **Philosophy**: "Compilers, not LLMs".
*   **Tools**:
    *   **Python**: `ast` module.
    *   **TypeScript/JS**: `TypeScript Compiler API` or `Tree-sitter`.
    *   **Java**: `JavaParser`.
    *   **Go**: `go/parser`.
*   **Extracts**: Endpoints, DB Models, Redis usage, Event Producers/Consumers.
*   **Deep Extraction**: Map function signatures and parameter types (essential for API diffs and contract validation).
*   **Microservice Stitching**: Parse `services.yaml` or config files to explicitly link services across repos.
*   **Fallback**: Use Regex/Basic Text Analysis for legacy frameworks/languages where Tree-sitter support is immature.
*   **Normalization**: Standardize all extracted nodes to a common schema (e.g., `{service, method, path, inputs, outputs}`) regardless of source language.
*   **Output**: Application mapping facts.

### 3.3 Step 3: Architecture Graph (The Core)
*   **Storage**: Neo4j.
*   **Node Types**: `Service`, `Endpoint`, `Database`, `Cache`, `Event`, `ExternalAPI`.
*   **Edge Types**: `CALLS`, `OWNS` (tables), `CACHES`, `EMITS`, `DEPENDS_ON`.
*   **Invariant**: This graph is the absolute source of truth.

### 3.4 Step 4: Rule Engine (Deterministic)
*   **Logic**: Hard-coded architectural rules.
*   **Example Checks**:
    *   `Frontend uses endpoint BUT Backend missing definition` -> ❌ Broken Contract.
    *   `Service A accesses Service B's DB` -> 🚨 Shared Database Anti-pattern.
    *   `Redis used without TTL` -> ⚠️ Memory Risk.
    *   `Redis used without TTL` -> ⚠️ Memory Risk.
*   **Advanced Features**:
    *   **Weighted Risk Scores**: Low/Medium/High severity for prioritizing fixes.
    *   **Early AQL**: Implement basic DSL immediately for flexible custom rules.
*   **Result**: A list of violations attached to graph nodes.

### 3.5 Step 5: AI Analyst (LangGraph)
*   **Role**: Controlled Reasoning Pipeline (Not an Agent).
*   **Input**: Graph Data + Rule Violations.
*   **Workflow**:
    `Context Builder` -> `LLM (Explanation)` -> `Formatter`.
*   **Capabilities**:
    *   Explain *why* a violation matters.
    *   Summarize the architecture for a human.
    *   Suggest standard improvements.
*   **Constraints**:
    *   NEVER modifies the graph structure. NEVER extracts facts.
    *   **Controlled Vocabulary**: Use pre-defined terminology (e.g., "Service A", "Database B") via prompt templates to prevent hallucinations.
*   **Outputs**:
    *   **Prompt Templates** (Rigid Control):
        *   **Constraint**: Reject prompts if `{endpoint}` or `{service}` placeholders are empty.
        *   **Endpoint Explanation**: `Explain endpoint {endpoint}: Inputs {params}, Outputs {response}, Dependencies {calls}.`
        *   **Violation Risk**: `Why is {violation_type} on {node} risky? Severity: {severity}. Recommendation: {fix}.`
        *   **Graph Summary**: `Summarize architecture: {service_count} services, {db_count} DBs. Key risks: {risk_summary}.`
    *   **Auto-Reports**: High-level system health, endpoint coverage, and DB ownership summaries.
    *   **Caching**: Cache AI responses per node/endpoint to reduce cost and latency.
    *   **Scope**: AI only reasons on subgraphs allowed by the user's RBAC role.

### 3.6 Step 6: Visualization Layer
*   **Rendering**: Pure Data → UI (React Flow / Cosmograph).
*   **Views**: API Maps, DB Ownership, Service Communication.
*   **Advanced Features**:
    *   **Filtering**: By Type (DB only), Tag (Violations only), or Team.
    *   **Heatmaps**: Overlay layers for traffic volume or latency (via log/trace integration).
    *   **Clustering**: Group nodes by Domain or Team to reduce noise.
    *   **Timeline Playback**: Visual slider to show architecture evolution over commits.
*   **No AI Generation**: The visualizer purely renders the deterministic graph.

## 4. Advanced Capabilities

### 4.1 Endpoint Understanding & Comparison Engine
*   **Frontend Graph**:  Parse `fetch`/`axios`/`ApolloClient` calls. Extract URLs and Methods.
*   **Backend Graph**: Parse `@Get()`, `@Post()`, `router.get()` definitions.
*   **The Diff**:
    *   `Match`: FE `/api/users` ↔ BE `/api/users`
    *   `Zombie Endpoint`: BE has `/api/v1/old` (0 references in FE).
    *   `Broken Link`: FE calls `/api/v2/products` (404 in BE).

### 4.2 Database per Service & Ownership
*   **Heuristic**: If `Service A` imports the ORM model covering table `orders`, it "Classic Owns" it.
*   **Violation**: If `Service B` executes a raw SQL query `SELECT * FROM orders`, flag as **Shared Database Anti-Pattern**.

### 4.3 Management & Collaboration Layer (New)
*   **User & Team Model**:
    *   **Workspaces**: Root entity containing Members and Projects.
    *   **Projects**: Can map to multiple Repositories (for Microservices spread across repos).
    *   **Roles**: Admin, Editor (Dev), Viewer (PM/Stakeholder).
*   **Repo Registration**:
    *   OAuth integration (GitHub/GitLab) to select and link repositories.
    *   Support for "Monorepo" (single repo, multiple sub-packages) vs "Multi-repo" (distinct repos per service).
*   **Interactive Visualization**:
    *   **Commenting**: Nodes and Edges support comment threads (like Figma). e.g., "Why does this Service call this DB directly?".
    *   **Annotations**: Persistent architect notes on specific sub-graphs.

---

## 5. Technology Stack Recommendation

### Backend / Core
*   **Orchestration**: **Python (FastAPI)**. Primary backend for Ingestion, API, and LangGraph integration.
    *   **Async Jobs**: **Celery** or **Redis Streams** for extraction tasks.
*   **Analyst**: **LangGraph** (Python). For the controlled reasoning pipeline.
*   **Static Analysis / Parsing**:
    *   **Python**: `ast` / `typed-ast` module.
    *   **Typescript/JS**: `ts-morph` or **Tree-sitter** JS binding.
    *   **Java**: `JavaParser`.
    *   **Go**: `go/parser` + `golang.org/x/tools/go/ssa`.
    *   **Repo Management**: `GitPython` or `PyGit2`.
*   **Databases**:
    *   **Primary (Relational)**: **PostgreSQL**. Users, Workspaces, Projects, Access Control, Audit Logs.
    *   **Graph**: **Neo4j** or **Memgraph**. Architecture graph (Services, Endpoints, DBs).
*   **Queue**: **Redis**.

### Frontend / Collaboration
*   **App Framework**: **Next.js** (React) + TailwindCSS.
*   **Auth**: **NextAuth.js** (GitHub/GitLab/Google OAuth).
*   **Visualization**:
    *   **Interactive Flow**: **React Flow** (Node-based diagrams).
    *   **Large Scale**: **Cosmograph** or **Sigma.js** (>10k nodes).
    *   **Diagram Gen**: `dbdiagram.io` (ERDs), **Mermaid** / **PlantUML** (Sequence/UML), **Graphviz**.
    *   **Export**: **Mermaid CLI** + **Puppeteer** for server-side PDF/PNG generation.
*   **Real-time Collaboration**:
    *   **State Sync**: **Yjs** + WebSocket server.
    *   **Notifications**: In-app alerts, Slack webhooks.

---

## 6. Critical Analysis & Improvements

### 6.1 Strategic Tech Improvements
1.  **Language-Agnostic Parsing**: Move beyond individual parsers.
    *   **Solution**: **Tree-sitter** + **Unified AST**. Convert all languages (Java, Go, TS) into a single "Universal Architecture Schema" (UAS) immediately after parsing. This decouples the core engine from language specifics.
2.  **Incremental Analysis**: CI/CD Scalability is non-negotiable.
    *   **Solution**: Only re-parse files modified in a PR. Use **Content Hashing** to track changes.
    *   **Visual Diff**: Highlight changed nodes in React Flow colors.
3.  **Cross-Repo Linking**:
    *   **Solution**: "Stitching" mechanism using:
        *   **Explicit Config**: `architecture.yaml` in repo root defining downstream dependencies.
        *   **Distributed Tracing**: Early integration with **OpenTelemetry / Jaeger** to validate static graph edges.
        *   **Service Discovery**: Infer edges from Kubernetes Service names or Docker labels.
    *   **Graph Search**: Allow queries like "Which service calls Redis?" or "All endpoints for Service X".
4.  **UI Performance (Semantic Zoom)**:
    *   **Solution**: Do not render all nodes at once.
        *   **Zoom Level 1**: System Containers (Monolith vs Microservices).
        *   **Zoom Level 2**: Services & Databases.
        *   **Zoom Level 3**: Modules, Controllers, & Internal Tables.
    *   Use **WebGL** (via Cosmograph or Sigma.js) for rendering 10k+ nodes smoothly.

### 6.2 Enterprise-Grade Features
1.  **Versioning & Audit**:
    *   **Time-Travel**: "Show me the architecture as of Commit X".
    *   **Audit Logs**: "Who approved this Schema change?" (essential for SOC2/compliance).
2.  **Multi-Team Roles**:
    *   Granular RBAC: Team A has `WRITE` access to Service A, but `READ-ONLY` for Service B.
3.  **Architecture Query Language (AQL)**:
    *   **Future-Proofing**: Instead of hardcoding 100 rules, build an early **DSL** (and Graph Query Templates for common scenarios).
    *   *Example*: `ALLOW Service(*) -> Database(OwnedBySameService)`
    *   This allows architects to write custom governance policies easily.
    *   **Granularity**: Allow custom rule sets per Workspace/Project.
    *   **Dynamic Severity**: Weighted risk scores (e.g., Shared DB in Prod = High, in Staging = Medium).
4.  **Security & Compliance**:
    *   **PII Scanning**: Optional scan for sensitive info in models/logs.
    *   **RBAC Enforcement**: Explicit checks in Backend (API) and Frontend (UI elements).
    *   **Secrets Masking**: Redact sensitive data in diagrams/UI for low-privilege users.
    *   **Compliance**: Automated SOC2/ISO27001 implementation checks via the Rules Engine.
5.  **Advanced Collaboration**:
    *   **Role-Specific Dashboards**: Custom views for Devs vs Architects vs PMs.
    *   **Versioned Annotations**: Rollback/audit comments.
    *   **Notifications**: Alerts for new architecture violations.
6.  **Security**:
    *   **Secrets Scanning**: Scan for API keys/credentials in connection strings (in addition to PII).

---

## 7. Implementation Roadmap & Tooling

### Phase 1: Ingestion & Extraction (Weeks 1-4)
*   **Backend Foundation**:
    *   [ ] Initialize **FastAPI** + **PostgreSQL** + **Neo4j** + **Redis**.
    *   [ ] Implement **OAuth** (GitHub/GitLab) for user repo access.
    *   [ ] repo ingestion via `GitPython`.
*   **Static Extractors**:
    *   [ ] Implement **Python Extractor** (`ast`).
    *   [ ] Implement **TS/JS Extractor** (`ts-morph` / `Tree-sitter`).
    *   [ ] Implement **Java/Go Extractors** (`JavaParser`, `go/parser`).
    *   [ ] Basic **Microservice Stitching** (parse `services.yaml`).
*   **Data Model**:
    *   [ ] Populate Neo4j with refined nodes (Service, Endpoint, DB).
    *   [ ] Extract function signatures/params (for API diffs).

### Phase 2: Rules & Visualization (Weeks 5-8)
*   **Visualization Layer**:
    *   [ ] Build Web UI with **Next.js** + **React Flow**.
    *   [ ] Implement Diagram Types:
        *   **Service Interaction Graph** (React Flow).
        *   **DB Diagrams (ERD)** (`dbdiagram.io` API).
        *   **Sequence Diagrams** (Mermaid).
    *   **Enhancements**:
        *   **Auto-Clustering**: Group services by Domain/Team in Mermaid/React Flow to reduce noise.
        *   **Multi-Format Export**: PNG/SVG/PDF export for all diagrams.
        *   **Timeline**: Slider to view graph evolution over commits.
    *   [ ] **Heatmaps**: Traffic/Latency overlay.
*   **Rule Engine**:
    *   [ ] Implement Hard-coded Rules (Shared DB, etc.).
    *   [ ] Implement **Weighted Risk Scores**.
*   **Collaboration**:
    *   [ ] **NextAuth.js** Role Management.
    *   [ ] **Yjs** + WebSocket for real-time commenting.

### Phase 3: The AI Analyst (Weeks 9-12)
*   **LangGraph Pipeline**:
    *   [ ] **Context Builder**: Fetch relevant sub-graph + violations.
    *   [ ] **LLM**: Explain "Why is this risky?" or "What does this service do?".
    *   [ ] **Constraint Check**: Ensure no hallucination (prompt templates).
*   **AI Applications**:
    *   [ ] **Endpoint Explanation**: Natural language summary of specific routes.
    *   [ ] **Graph Summarization**: High-level report for PMs.
    *   [ ] **Violation Insights**: Explaining technical debt impact.

### Phase 4: Enterprise & Polish (Weeks 13+)
*   **CI/CD Integration**:
    *   [ ] **GitHub Actions** runner for incremental parsing.
    *   [ ] Content Hashing for caching unchanged files.
*   **Advanced Features**:
    *   [ ] **Role-Specific Dashboards** (Architect vs Dev).
    *   [ ] **Notifications** (Slack/Email) for architectural drift.
    *   [ ] **Exports**: PDF/PNG Reports (via Graphviz/Puppeteer).
*   **Security & Compliance**:
    *   [ ] **Secrets Scanning**: Check for API keys/creds.
    *   [ ] **Audit Logs**: Track who annotated/approved changes.

### 8. Execution Flow & Validation Strategy
1.  **Ingestion Validation**:
    *   [ ] OAuth Handshake successful.
    *   [ ] Clone & Detect Language Correctly.
2.  **Extraction & Graph Pop**:
    *   [ ] Static Extractors run (Tree-sitter/AST).
    *   [ ] **Fallback**: Regex runs on legacy files.
    *   [ ] Neo4j Graph populated & Invariants checked.
3.  **Visualization & Rules**:
    *   [ ] Rule Engine runs -> Violations tagged.
    *   [ ] React Flow renders graph.
    *   [ ] **Mermaid** generates static microservice diagrams.
4.  **AI Analyst (Safe Mode)**:
    *   [ ] Run **LangGraph** with locked templates.
    *   [ ] Verify no extra nodes created.
5.  **Final Checks**:
    *   [ ] **RBAC**: Verify "Viewer" cannot see Secrets.
    *   [ ] **Export/Report**: Generate PDF with ERD + Sequence Diagram.
    *   [ ] **Visual Regression**: Compare hashes of generated diagrams to detect unexpected visual changes.
    *   [ ] **Integration Test**: Full flow (OAuth -> Ingest -> Extract -> Graph -> UI).
    *   [ ] **Edge Cases**: Verify behavior with legacy frameworks and mixed languages.
