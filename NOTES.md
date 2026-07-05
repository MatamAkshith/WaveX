# Project Vision
An AI Decision Operating System built in FastAPI to orchestrate planning, expert analysis, and multi-agent synthesis for organizational decisions.

# Architecture
The application follows a clean, modular FastAPI design utilizing synchronous SQLAlchemy for core operations, pydantic-settings for configuration management, and a multi-agent framework for processing queries.

## [2026-07-04T16:40:00+05:30]
- **What changed**: Initialized core API contracts, stub agent classes, database session management, and environment configurations.
- **Why it changed**: Provide a consistent structure for frontend consumption and database access before implementing complex agent logic and RAG.
- **Impact**: All endpoints return valid mock data immediately without external network or DB calls.

# Backend
FastAPI server initialized with CORS middleware allowing all origins. Lifespan events dispose of database engine connections upon shutdown.

# Frontend
*Placeholder for frontend configuration and build details.*

# Database
- **Dialect/Driver**: PostgreSQL with `psycopg2-binary` and SQLAlchemy (Synchronous).
- **Session Management**: Session generator (`deps.py:get_db`) utilizing a context-closed `SessionLocal`.
- **Migrations**: Alembic configuration dynamically fetches configurations from the centralized settings module.

# AI Agents
Stub classes defined inside `app/agents/base.py`:
- `PlannerAgent`: Orchestrates expert consultation.
- `FinanceAgent`, `HiringAgent`, `LegalAgent`, `GTMAgent`: Expert analysis agents implementing `analyze`.
- `JudgeAgent`: Synthesizes analyses into a unified recommendation.

# RAG
*Placeholder for ChromaDB and LangChain configuration.*

# APIs
Endpoints defined in [routes.py](file:///Users/ashu/Documents/VMEG/Hackathons/VYNEDAM/WaveX/backend/app/api/routes.py):
- `POST /company`: Registers a company.
- `POST /decision`: Evaluates a query and generates synthesized mock recommendations.
- `GET /decision/{id}`: Retrieves individual decision profiles.
- `GET /history`: Lists all analyzed queries.
- `POST /approve`: Submits approvals/rejections.
- `GET /health`: Simple system health probe.

# Environment
- Centralized configuration managed via `app.core.config.settings` loading variables from `.env`.
- Env variables: `DATABASE_URL`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `CHROMA_DB_PATH`, `ENVIRONMENT`, `DEBUG`.

# Decisions
- **Synchronous SQLAlchemy**: Retained synchronous DB connections over async.
- **Immediate Mock Routing**: Mock schemas are returned directly to allow frontend development decoupling.

# Future Improvements
- Implement database connection verification inside checking handlers.
- Integrate ChromaDB for similarity searching context.

# Important TODOs
- [ ] Connect agent stubs to LLM APIs (OpenAI/Gemini).
- [ ] Integrate PostgreSQL persistence for company and decision tables.
