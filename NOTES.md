# Project Vision
DecisionOS is an AI Decision Operating System for Startup Founders that equips founders with structured business intelligence, cross-specialists debate models, and perpetual organizational memory to make executive-level strategic decisions[cite: 4]. 

Unlike standard conversational chatbots, DecisionOS relies on a multi-agent consensus architecture coupled with a local company context index as its operational core[cite: 4].

---

# Architecture
The system follows a modular client-server structure[cite: 4]:
- **Frontend**: Single-page modern dashboard application build on React 19 + Vite 8 + Tailwind CSS v4 + Framer Motion[cite: 4].
- **Backend**: Python FastAPI service providing[cite: 4]:
  - Company APIs[cite: 4]
  - Decision APIs[cite: 4]
  - Document APIs[cite: 4]
  - AI Orchestration[cite: 4]
  - Database Layer[cite: 4]

The application utilizes synchronous SQLAlchemy for core operations, pydantic-settings for configuration management, and a multi-agent framework for processing queries[cite: 3].

---

# Frontend
DecisionOS landing page structure & client application pages[cite: 4]:
- `src/components/Navbar.jsx`: Glassmorphism responsive status-tracking navbar[cite: 4].
- `src/components/Hero.jsx`: Dual-column dashboard visualization + product pitch layout[cite: 4].
- `src/components/DashboardMockup.jsx`: Interactive mock workspace showcasing operational runways, MRR growth sparklines, and active specialist agent consensus blocks[cite: 4].
- `src/components/TrustedBy.jsx`: Interactive scale animations for venture client logs[cite: 4].
- `src/components/Features.jsx`: 6-feature card layouts highlighting decision intelligence modules[cite: 4].
- `src/components/HowItWorks.jsx`: Multi-stage interactive workflows (horizontal on desktop, vertical on mobile)[cite: 4].
- `src/components/WhyDecisionOS.jsx`: Design differences comparison with SVG schematic diagrams[cite: 4].
- `src/components/CTA.jsx`: Call to action portal[cite: 4].
- `src/components/Footer.jsx`: Direct SVG paths mapping social nodes and roadmap links[cite: 4].
- `src/components/AuthCard.jsx`: Glass container wrapper with animated entry[cite: 4].
- `src/components/InputField.jsx`: Text field component carrying automated input focus, label headers, and error states[cite: 4].
- `src/components/PasswordField.jsx`: Masked password controller with visibility toggles and level strength gauges[cite: 4].
- `src/components/SocialLoginButton.jsx`: Render element carrying custom Google brand symbols[cite: 4].
- `src/components/AuthHeader.jsx`: Multi-page logo brand header[cite: 4].
- `src/components/AuthFooter.jsx`: Bottom link dots and copyright notice tracker[cite: 4].
- `src/pages/Landing.jsx`: Extracted landing component[cite: 4].
- `src/pages/Login.jsx`: Welcome interface carrying input checks[cite: 4].
- `src/pages/Signup.jsx`: Workspace registration wizard[cite: 4].
- `src/pages/ForgotPassword.jsx`: Reset link delivery platform[cite: 4].
- `src/pages/Dashboard.jsx`: Strategic boardroom simulations space with historical ledgers[cite: 4].

---

# Backend
Python FastAPI service providing[cite: 4]:
- Company APIs[cite: 4]
- Decision APIs[cite: 4]
- Document APIs[cite: 4]
- AI Orchestration[cite: 4]
- Database Layer[cite: 4]

The server is initialized with CORS middleware allowing all origins[cite: 3]. Lifespan events dispose of database engine connections upon shutdown[cite: 3].

---

# Database
- **Dialect/Driver**: PostgreSQL with `psycopg2-binary` and SQLAlchemy (Synchronous)[cite: 3].
- **Session Management**: Session generator (`deps.py:get_db`) utilizing a context-closed `SessionLocal`[cite: 3].
- **Migrations**: Alembic configuration dynamically fetches configurations from the centralized settings module[cite: 3].

---

# AI Agents
The decision engine workspace showcases collaboration among[cite: 4]:
- **Planner Agent**[cite: 4]
- **Finance Agent**[cite: 4]
- **Hiring Agent**[cite: 4]
- **Legal Agent**[cite: 4]
- **GTM Agent**[cite: 4]
- **Judge Agent**[cite: 4]

---

# RAG
Documents will be indexed vector-wise to feed local company context automatically into the multi-agent debate stream[cite: 4]. Placeholder for ChromaDB and LangChain configuration[cite: 3].

---

# APIs
- `POST /company`[cite: 4]
- `GET /company/{id}`[cite: 4]
- `PUT /company/{id}`[cite: 4]
- `POST /documents/upload`[cite: 4]
- `GET /documents`[cite: 4]
- `POST /decision`[cite: 4]
- `GET /decision/{id}`[cite: 4]
- `GET /history`[cite: 4]
- `POST /decision/{id}/approve`[cite: 4]
- `POST /decision/{id}/reject`[cite: 4]
- `GET /health`[cite: 4]

---

# Environment
Centralized configuration managed via `app.core.config.settings` loading variables from `.env`[cite: 3]. Env variables:
- `DATABASE_URL`[cite: 4]
- `OPENAI_API_KEY`[cite: 4]
- `GEMINI_API_KEY`[cite: 4]
- `CHROMA_DB_PATH`[cite: 4]
- `ENVIRONMENT`[cite: 4]
- `DEBUG`[cite: 4]

---

# Decisions

## 2026-07-04T16:40:00+05:30
### Core Infrastructure & Synchronous DB Layer Initialization
- **What changed**: Initialized core API contracts, stub agent classes, database session management, and environment configurations[cite: 3].
- **Why it changed**: Provide a consistent structure for frontend consumption and database access before implementing complex agent logic and RAG[cite: 3].
- **Impact**: All endpoints return valid mock data immediately without external network or DB calls[cite: 3]. Retained synchronous DB connections over async[cite: 3].

## 2026-07-04T17:03:00+05:30
### Router Modularization and Schema Isolation
- **What changed**: Refactored the single API routes file into modular routers (`company.py`, `documents.py`, `decision.py`) and froze strict schemas in `models.py`[cite: 3].
- **Why it changed**: Keep the codebase modular as endpoints grow to support file uploads and detailed decision statuses[cite: 3].
- **Impact**: API routes are now served under prefixes `/company`, `/documents`, `/decision`[cite: 3].
- **SUPERSEDED**: Previous approach used a single flat router inside `app/api/routes.py` registering all routes under root `/`[cite: 3].

## 2026-07-04T17:25:00+05:30
### Initial Frontend Landing Page Architecture Implementation
- **What changed**: Created a complete, production-quality, responsive landing page using Vite, React 19, Tailwind CSS v4, Framer Motion, and Lucide React icons[cite: 4].
- **Why it changed**: Initial bootstrap of the DecisionOS mock workspace layout to outline company overview trackers, AI decision report panel, and specialist agent lists[cite: 4].
- **Impact**: Establishes dark design system (#0B0B0B base, glassmorphism cards, purple/blue subtle gradients, Inter font family) and successfully builds client-side bundles with zero errors[cite: 4]. Brand icons originally imported from `lucide-react` were replaced with custom inline SVGs due to brand icon deprecations in Lucide v0.400+[cite: 4].

## 2026-07-04T17:35:00+05:30
### Single-Page Routing and Authentication Module Integration
- **What changed**: Introduced `react-router-dom` navigation and integrated multi-page login, signup, forgot password interfaces, and a dynamic dashboard workspace simulation panel[cite: 4].
- **Why it changed**: Built secure workspace access routes mapping to mock user authentication systems[cite: 4].
- **Impact**: Enables smooth CSS client transitions, password visibility control, dynamic parameter indicators (strength meter), visual loading cues, and simulated multi-agent consensus responses inside a workspace terminal[cite: 4].

## 2026-07-04T17:45:00+05:30
### Google SSO Prototype Notice Implementation
- **What changed**: Modified "Continue with Google" actions in Login and Signup flows to render a customized info notice instead of simulating successful access[cite: 4].
- **Why it changed**: Clarified that Google Authentication is a prototype interface component rather than an active OAuth credentials workflow[cite: 4].
- **Impact**: Injects a custom violet absolute toast indicating prototype bounds, cleanly preserving the primary username/password simulated login redirection actions[cite: 4].

## 2026-07-04T17:55:00+05:30
### Dashboard Application Layout Shell and Subroutes Implementation
- **What changed**: Implemented collapsible side navigation panel, persistent header bars containing mock searches and notification alerts, responsive hamburger overlays on mobile formats, and custom pages `/company`, `/founder`, `/documents`, `/decision`, `/history`, and `/settings`[cite: 4].
- **Why it changed**: Expanded workspace dashboards into a shared, robust application layout shell serving all route resources[cite: 4].
- **Impact**: Establishes high-fidelity templates carrying functional parameters: file managers equipped with drag-drop RAG upload hooks, filterable decision ledgers, interactive multi-agent debate trigger terminals, and editable consensus threshold range bars[cite: 4].

## 2026-07-04T18:20:00+05:30
### Polish Dashboard UX and Layout Overlap Resolution
- **What changed**: Disabled the theme switcher mockup button (forcing permanent dark mode), removed infinite pulse and ping animations (expert items status indicator and profile notification bells), corrected z-index properties across dropdown actions, drawer backdrops, and sidebar overlays, and converted the responsive sidebar transitions to layout-stable pure CSS selectors[cite: 4].
- **Why it changed**: Addressed UI issues regarding overlay containment boundaries, viewport layout shifts, and visual clutter from flashing indicators[cite: 4].
- **Impact**: Establishes a highly-polished, responsive UI system that prevents overlapping elements, ensures tooltips stay inside viewport limits, and guarantees consistent glassmorphism shadows without horizontal scrolling issues[cite: 4].

## 2026-07-04T18:25:00+05:30
### Refined TopNavbar Notifications Dropdown Visual Layout
- **What changed**: Sized notifications dropdown exactly to `w-[350px]` with `max-h-[350px]` and internal scroll bars, added a spacing offset of 14px under the navbar boundary bottom line, added rounded card borders, and configured click-away backdrops at z-index 40[cite: 4].
- **Why it changed**: Resolved visual layout issues where notifications overlapped primary dashboard grids or extended beyond view limits[cite: 4].
- **Impact**: Guarantees zero layout shifts and absolute overlay placement without obstructing dashboard card components[cite: 4].

## 2026-07-04T20:53:00+05:30
### Agent Interface Abstraction & Decision Service Orchestration
- **What changed**: Created abstract interface `BaseAgent` and transitioned `PlannerAgent`, `FinanceAgent`, and `JudgeAgent` stubs to inherit from `BaseAgent`[cite: 3]. Created `DecisionService` to coordinate execution using asynchronous concurrency (`asyncio.gather`)[cite: 3].
- **Why it changed**: Provide a clean structure for orchestrating agent interactions and executing expert analyses concurrently[cite: 3].
- **Impact**: Backend agents are structured under a standard interface[cite: 3]. `DecisionService` allows simple background execution of agent workflows[cite: 3].
- **SUPERSEDED**: Non-ABC class declarations inside `app/agents/base.py` without standard async execute interfaces are replaced by concrete declarations under `app/agents/implementations.py`[cite: 3].

## 2026-07-04T21:19:00+05:30
### FastAPI Backend Integration & Execution State Timeline UI Implementation
- **What changed**: Replaced frontend static mocked datasets with active FastAPI REST integrations using standard browser `fetch` and custom React hooks (`useCompany`, `useDecision`, and `useDocuments`)[cite: 4]. Enabled company profile editing with status alerts, built an animated Framer Motion multi-agent timeline execution UI, wired ledger cards to history fetch logs, and configured drag-and-drop uploading to use FormData with progress bars[cite: 4].
- **Why it changed**: Integrated the client prototype with real backend service endpoints to demonstrate functional data flow and visual execution states during AI pipeline runs[cite: 4].
- **Impact**: Establishes end-to-end data communication, adds visual loading cues, maintains zero layout shift, and builds cleanly with no compilation errors[cite: 4].

---

# Future Improvements
- Integration of actual multi-agent websocket endpoints for running real-time debate sequences[cite: 4].
- Dynamic drag-and-drop document upload workspace in client dashboard[cite: 4].
- Live interactive charts rendered via Recharts or D3[cite: 4].
- Implement database connection verification inside checking handlers[cite: 3].
- Decision Memory[cite: 4]
- Decision Confidence Calibration[cite: 4]
- WebSocket Streaming[cite: 4]
- Company Learning[cite: 4]
- Outcome Tracking[cite: 4]

---

# Important TODOs
- [ ] Connect mockup dashboard actions to a simulated workspace sandbox[cite: 4].
- [ ] Integrate PostgreSQL persistence for company and decision tables[cite: 3].
- [ ] Integrate Planner[cite: 4]
- [ ] Integrate Judge[cite: 4]
- [ ] Integrate RAG[cite: 4]
- [ ] Connect ML Pipeline[cite: 4]