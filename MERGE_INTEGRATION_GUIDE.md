# WaveX Integration Guide: rag-database → frontend Merge

## Summary
This document outlines the merge of the `rag-database` branch into `frontend`, integrating the full FastAPI backend with RAG capabilities into the React frontend application.

## Branch Contents

### rag-database Branch (Backend + RAG Infrastructure)
- **FastAPI Backend** with multi-agent orchestration
- **ChromaDB** vector database for RAG (Retrieval-Augmented Generation)
- **SQLAlchemy ORM** with SQLite/PostgreSQL support
- **Groq LLM Integration** for AI agents
- **Complete API** for decision analysis, document ingestion, and company management
- **Global Knowledge Bases** (legal + finance) pre-seeded
- **Database Firewall** with X-API-Key authentication

### frontend Branch (React UI)
- **React + Vite** modern development setup
- **TypeScript** type safety
- **Tailwind CSS** styling
- **Component architecture** for founder interface

## Merge Strategy

### Non-Conflicting Changes ✓
The branches operate on different parts of the project:
- **Backend/** → New folder structure added by rag-database
- **Frontend/** → Existing React application (if present)
- **root configs** → Both branches can coexist

### File Structure After Merge
```
WaveX/
├── backend/                           # NEW (from rag-database)
│   ├── app/
│   │   ├── agents/                   # AI agents (Planner, Finance, Legal, Hiring, GTM, Judge)
│   │   ├── api/                      # FastAPI routes
│   │   ├── core/                     # Config, security, LLM client
│   │   ├── database/                 # SQLAlchemy models, sessions
│   │   ├── models/                   # ORM entities (Company, Decision, Document)
│   │   ├── rag/                      # RAG pipeline (ingest, retrieve, seed)
│   │   ├── schemas/                  # Pydantic request/response schemas
│   │   └── main.py                   # FastAPI app entry
│   ├── requirements.txt               # Python dependencies
│   ├── .env.example                   # Environment variables template
│   ├── Dockerfile                     # Container config
│   ├── Procfile                       # Deployment config
│   ├── alembic/                       # Database migrations
│   ├── README.md                      # Backend docs
│   └── INTEGRATION_PROTOCOL.md        # Team collaboration rules
│
├── frontend/                          # EXISTING (preserved)
│   ├── src/
│   ├── package.json
│   └── ...
│
├── presentation/                      # NEW (from rag-database)
│   └── tech_stack_slide.svg          # Visual architecture
│
├── .gitignore                         # MERGED (Python + Node patterns)
├── NOTES.md                           # Project documentation
├── PROJECT_NOTES.md                   # Architecture notes
├── PROJECT_PROGRESS.txt               # Hackathon progress log
└── README.md                          # Root documentation
```

## Installation & Setup

### Prerequisites
- **Python 3.11+** (for backend)
- **Node.js 18+** (for frontend)
- **pip** and **npm** package managers

### 1. Backend Setup (FastAPI + RAG)

```bash
# Navigate to backend directory
cd backend

# Create Python virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template and configure
cp .env.example .env

# Configure .env with your API keys:
# GROQ_API_KEY=your-groq-api-key-here (required for agents)
# OPENAI_API_KEY=your-openai-api-key-here (optional)
# GEMINI_API_KEY=your-gemini-api-key-here (optional)
# DATABASE_URL=sqlite:///./wavex.db (default, swap to PostgreSQL if needed)
# API_KEY=choose-a-strong-key (optional, enables database firewall)

nano .env  # or open with your editor
```

**Get API Keys:**
- **Groq API**: Sign up at [console.groq.com](https://console.groq.com)
- **OpenAI API**: Sign up at [platform.openai.com](https://platform.openai.com)
- **Gemini API**: Sign up at [ai.google.dev](https://ai.google.dev)

### 2. Start Backend Server

```bash
# From backend/ directory (with venv activated)
uvicorn app.main:app --reload

# Expected output:
# INFO:     Uvicorn running on http://127.0.0.1:8000
# INFO:     Application startup complete
```

**Backend endpoints available at:**
- **API Docs (Swagger UI)**: http://127.0.0.1:8000/docs
- **Health Check**: http://127.0.0.1:8000/health
- **API Root**: http://127.0.0.1:8000/

### 3. Frontend Setup (React + Vite)

Open a **new terminal window**:

```bash
# Navigate to frontend directory
cd frontend

# Install Node dependencies
npm install

# Start Vite development server
npm run dev

# Expected output:
#   VITE v4.x.x  ready in xxx ms
#   ➜  Local:   http://localhost:5173/
#   ➜  press h + enter to show help
```

**Frontend available at:** http://localhost:5173/

### 4. Connect Frontend to Backend

Update your frontend API client configuration to point to the backend:

**Example (create or update `frontend/src/api/client.ts`):**
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

export const apiClient = {
  async createCompany(data) {
    return fetch(`${API_BASE_URL}/company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json());
  },
  
  async createDecision(data) {
    return fetch(`${API_BASE_URL}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json());
  },
  
  // Add more endpoints as needed...
};
```

## Full Integration Workflow

### Step 1: Verify Both Servers
```bash
# Terminal 1 (Backend):
cd backend
source venv/bin/activate  # or activate.bat on Windows
uvicorn app.main:app --reload
# Should see: Application startup complete

# Terminal 2 (Frontend):
cd frontend
npm run dev
# Should see: Local: http://localhost:5173/
```

### Step 2: Test Backend Connectivity
Open http://127.0.0.1:8000/health in your browser:
```json
{
  "status": "healthy",
  "database": "configured",
  "firewall": "disabled (set API_KEY to enable)"
}
```

### Step 3: Test Full Decision Pipeline
Use Swagger UI at http://127.0.0.1:8000/docs:

1. **Create a Company**
   - POST `/company`
   - Payload: `{ "name": "Acme Inc", "industry": "SaaS", "size": "10-50" }`

2. **Upload a Document (Optional)**
   - POST `/company/{id}/documents`
   - Upload a PDF/TXT/MD file

3. **Create a Decision**
   - POST `/decision`
   - Payload:
     ```json
     {
       "title": "Should we hire 3 engineers?",
       "context": "Planning Q3 hiring with current runway of 18 months",
       "question": "What's the optimal hiring plan for our current runway?",
       "company_id": 1
     }
     ```

4. **Check the Response**
   - Review expert analyses from Finance, Hiring, Legal, GTM agents
   - View final Judge recommendation
   - See `similar_past_decision` if available

### Step 4: Build Frontend UI
Connect the Swagger-tested endpoints to your React components:

**Example Component Structure:**
```
frontend/src/
├── components/
│   ├── CompanyForm.tsx        # Register company
│   ├── DocumentUpload.tsx      # Upload KB docs
│   ├── DecisionForm.tsx        # Submit decision question
│   ├── DecisionResult.tsx      # Display analyses + recommendation
│   └── DecisionHistory.tsx     # View past decisions
├── pages/
│   ├── Dashboard.tsx           # Main interface
│   └── DecisionDetail.tsx      # Single decision view
├── api/
│   └── client.ts               # API wrapper
└── types/
    └── wavex.ts                # TypeScript types for responses
```

## Database Configuration

### Default (SQLite - No Setup Needed)
```
DATABASE_URL=sqlite:///./wavex.db
```
- **Pros**: Zero setup, instant development, perfect for hackathon
- **Cons**: Single-process only, not suitable for production
- **Data persists** to `wavex.db` file automatically

### Production (PostgreSQL)
```
DATABASE_URL=postgresql://user:password@localhost:5432/wavex_db
```
1. Install PostgreSQL locally or use a service (AWS RDS, Supabase, etc.)
2. Create a database:
   ```sql
   CREATE DATABASE wavex_db;
   ```
3. Update `.env` with your connection string
4. Tables are created automatically on first API boot

## Environment Variables Checklist

| Variable | Required? | Example |
|----------|-----------|---------|
| `GROQ_API_KEY` | ✓ Yes | `gsk_...` (from console.groq.com) |
| `DATABASE_URL` | ✓ Yes | `sqlite:///./wavex.db` (default) |
| `OPENAI_API_KEY` | Optional | `sk_...` (fallback LLM) |
| `GEMINI_API_KEY` | Optional | `AIza...` (fallback LLM) |
| `API_KEY` | Optional | Any string (enables firewall) |
| `ALLOWED_ORIGINS` | No | `http://localhost:5173,http://127.0.0.1:3000` |
| `CHROMA_DB_PATH` | No | `./chroma_db` (default) |
| `ENVIRONMENT` | No | `development` (default) or `production` |
| `DEBUG` | No | `True` (default) or `False` |

## API Endpoints Reference

### Companies
- `POST /company` — Register company
- `GET /company/{id}/documents` — List documents
- `POST /company/{id}/documents` — Upload document

### Decisions
- `POST /decision` — Create and analyze decision
- `GET /decision/{id}` — Fetch one decision
- `GET /history` — List all decisions

### Approvals
- `POST /approve` — Approve/reject + index to memory

### System
- `GET /health` — Health check
- `GET /` — Root endpoint
- `POST /firewall/enable` — Arm database firewall
- `POST /firewall/disable` — Disarm firewall (keyholder only)

## Troubleshooting

### Backend won't start: `ModuleNotFoundError`
```bash
# Ensure venv is activated and requirements installed
source venv/bin/activate
pip install -r requirements.txt
```

### GROQ API errors
- Check `GROQ_API_KEY` in `.env`
- Verify key is valid at [console.groq.com](https://console.groq.com)
- Agents degrade gracefully — if key is missing, mock responses are returned

### Frontend CORS errors
- Backend CORS is configured for `localhost:5173` by default
- If frontend runs on different port, update `ALLOWED_ORIGINS` in `.env`

### Database connection errors
- For SQLite: ensure `wavex.db` directory is writable
- For PostgreSQL: verify connection string and DB exists
- Check logs: `ERROR: Could not connect to database`

### ChromaDB / Embedding model download
- First document upload downloads the embedding model (~80MB)
- This happens once and is cached in `./chroma_db`
- Subsequent uploads are instant

## Next Steps

1. **Review Architecture** → Read `PROJECT_PROGRESS.txt` for full system overview
2. **Test Endpoints** → Use Swagger UI to validate each API
3. **Build Components** → Connect endpoints to React UI
4. **Add Authentication** → Consider JWT or OAuth for production
5. **Deploy** → Use Docker (`docker build -t wavex-backend .`) or cloud platform

## Key Features Integrated

✓ Multi-agent decision orchestration (Planner → Experts → Judge)
✓ RAG with ChromaDB (semantic search + document ingestion)
✓ Decision Memory (similar past decisions surface + re-evaluation)
✓ Global Knowledge Bases (legal + finance curated content)
✓ Database Firewall (optional X-API-Key authentication)
✓ Full audit trail (Decision Ledger persists all analyses)
✓ Graceful degradation (agents work even if LLM APIs fail)

---

**Status**: ✅ All branches merged, ready for local development

**Questions?** Refer to `backend/README.md`, `NOTES.md`, or the Swagger docs at http://127.0.0.1:8000/docs
