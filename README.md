# WaveX
## Running WaveX (full stack)

Two terminals, both from the repo root.

### Terminal 1 - Backend (FastAPI)
```
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
Needs `backend/.env` with `GROQ_API_KEY=gsk_...` (see .env.example).
API playground: http://127.0.0.1:8000/docs

### Terminal 2 - Frontend (React + Vite)
```
npm install
npm run dev
```
App: http://localhost:5173

### Demo flow
1. Dashboard -> **Documents**: upload a financial plan (.txt/.pdf) - watch it index
2. **Ask Decision**: "Should we hire 5 senior engineers this quarter given our budget?"
   - Planner selects only the relevant experts
   - Analyses cite your uploaded documents and the local knowledge bases
   - Hiring/GTM agents attach a ready-to-use deliverable
3. **Reject** the recommendation from the consensus card
4. Ask the same question again -> amber **Decision Memory** banner,
   Judge explicitly re-evaluates the earlier rejection
5. **Decision Ledger** page shows the audited history
6. Firewall demo: POST /firewall/enable in /docs -> data routes return 401
   without X-API-Key; disabling requires the key
https://claude.ai/chat/1d35c9fc-1cc7-4762-b824-c167bec5f7b8
