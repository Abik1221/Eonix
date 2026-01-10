# AI Agent Architecture Strategy

## Core Philosophy
**"Deterministic system first, AI as an intelligent analyst on top."**

Our AI does not blindly parse code. We use strict deterministic parsers to build a ground-truth graph of the system (Services, Endpoints, DBs). The AI's role is to **explain, analyze, and recommend** based on this graph.

## The 4-Agent Model

### 1. Context Builder (Deterministic - NO AI)
- **Role**: Scans codebase to generate a structured JSON graph.
- **Input**: Source code, Dockerfiles, config files.
- **Output**:
  ```json
  {
    "services": ["Auth", "Payments"],
    "endpoints": ["/login", "/pay"],
    "databases": ["Postgres"],
    "connections": [{"from": "Auth", "to": "Postgres"}]
  }
  ```
- **Why**: AI hallucinations in topology are unacceptable. This layer provides ground truth.

### 2. Architecture Analyst (LLM)
- **Role**: The "Senior Staff Engineer".
- **Trigger**: New analysis or "Explain Architecture" request.
- **Input**: The structured JSON graph.
- **Output**: High-level summary, system purpose, critical risks, and architectural strengths.

### 3. Problem Detection & Explainer (LLM)
- **Role**: The "Risk Assessor".
- **Trigger**: Rule violations detected (e.g., Shared DB).
- **Input**: Specific violation metadata.
- **Output**: Human-readable explanation of *why* this is bad (e.g., "Blast radius," "Coupling") and severity assessment.

### 4. Recommendation Agent (LLM)
- **Role**: The "Fixer".
- **Trigger**: Specific bottlenecks or user request for improvement.
- **Input**: Traffic patterns, coupling data.
- **Output**: Concrete actionable advice (e.g., "Implement Redis caching for /products").

## UI/UX Integration Principles
- **No intrusive Chatbots**: AI appears as "Insights" or "Analysis", not a chat bubble.
- **On-Demand**: Heavy analysis runs only when triggered ("Generate Report", "Analyze Risks").
- **Visual First**: Show the graph first, then let AI explain it.
- **Contextual**: AI help is placed near the problem (e.g., "Why is this a problem?" button on a violation card).
