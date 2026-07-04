# Project Vision
DecisionOS is an AI Decision Operating System for Startup Founders that equips founders with structured business intelligence, cross-specialists debate models, and perpetual organizational memory to make executive-level strategic decisions. 

Unlike standard conversational chatbots, DecisionOS relies on a multi-agent consensus architecture coupled with a local company context index as its operational core.

---

# Architecture
The system follows a modular client-server structure:
- **Frontend**: Single-page modern dashboard application build on React 19 + Vite 8 + Tailwind CSS v4 + Framer Motion.
- **Backend (Future)**: Python FastAPI decision generation orchestration service connecting specialist agents (Finance, Hiring, Legal, GTM, Product).

---

# Frontend
DecisionOS landing page structure & client application pages:
- `src/components/Navbar.jsx`: Glassmorphism responsive status-tracking navbar.
- `src/components/Hero.jsx`: Dual-column dashboard visualization + product pitch layout.
- `src/components/DashboardMockup.jsx`: Interactive mock workspace showcasing operational runways, MRR growth sparklines, and active specialist agent consensus blocks.
- `src/components/TrustedBy.jsx`: Interactive scale animations for venture client logs.
- `src/components/Features.jsx`: 6-feature card layouts highlighting decision intelligence modules.
- `src/components/HowItWorks.jsx`: Multi-stage interactive workflows (horizontal on desktop, vertical on mobile).
- `src/components/WhyDecisionOS.jsx`: Design differences comparison with SVG schematic diagrams.
- `src/components/CTA.jsx`: Call to action portal.
- `src/components/Footer.jsx`: Direct SVG paths mapping social nodes and roadmap links.
- `src/components/AuthCard.jsx`: Glass container wrapper with animated entry.
- `src/components/InputField.jsx`: Text field component carrying automated input focus, label headers, and error states.
- `src/components/PasswordField.jsx`: Masked password controller with visibility toggles and level strength gauges.
- `src/components/SocialLoginButton.jsx`: Render element carrying custom Google brand symbols.
- `src/components/AuthHeader.jsx`: Multi-page logo brand header.
- `src/components/AuthFooter.jsx`: Bottom link dots and copyright notice tracker.
- `src/pages/Landing.jsx`: Extracted landing component.
- `src/pages/Login.jsx`: Welcome interface carrying input checks.
- `src/pages/Signup.jsx`: Workspace registration wizard.
- `src/pages/ForgotPassword.jsx`: Reset link delivery platform.
- `src/pages/Dashboard.jsx`: Strategic boardroom simulations space with historical ledgers.

---

# Backend
*To be implemented in subsequent phases.*

---

# Database
*To be implemented in subsequent phases. Draft plans highlight a local SQLite layer for cap tables, runway metrics, and session histories.*

---

# AI Agents
The decision engine workspace showcases collaboration among:
- **Finance AI**: Active Runway & Burn analysis.
- **Hiring AI**: Team org expansion and role valuation.
- **Legal AI**: Regulatory compliance and GDPR overhead calculations.
- **GTM AI**: Acquisition metrics and customer-acquisition cost optimization.
- **Product AI**: Feature roadmap stress-tests.
- **Strategy AI**: Inter-agent synthesis and board proposal formulation.

---

# RAG
*To be implemented in subsequent phases. Documents will be indexed vector-wise to feed local company context automatically into the multi-agent debate stream.*

---

# APIs
*To be defined.*

---

# Environment
*To be defined.*

---

# Decisions

## 2026-07-04T17:25:00+05:30
### Initial Frontend Landing Page Architecture Implementation
- **What changed**: Created a complete, production-quality, responsive landing page using Vite, React 19, Tailwind CSS v4, Framer Motion, and Lucide React icons.
- **Why it changed**: Initial bootstrap of the DecisionOS mock workspace layout to outline company overview trackers, AI decision report panel, and specialist agent lists.
- **Impact**: Establishes dark design system (#0B0B0B base, glassmorphism cards, purple/blue subtle gradients, Inter font family) and successfully builds client-side bundles with zero errors. Brand icons originally imported from `lucide-react` were replaced with custom inline SVGs due to brand icon deprecations in Lucide v0.400+.

## 2026-07-04T17:35:00+05:30
### Single-Page Routing and Authentication Module Integration
- **What changed**: Introduced `react-router-dom` navigation and integrated multi-page login, signup, forgot password interfaces, and a dynamic dashboard workspace simulation panel.
- **Why it changed**: Built secure workspace access routes mapping to mock user authentication systems.
- **Impact**: Enables smooth CSS client transitions, password visibility control, dynamic parameter indicators (strength meter), visual loading cues, and simulated multi-agent consensus responses inside a workspace terminal.

## 2026-07-04T17:45:00+05:30
### Google SSO Prototype Notice Implementation
- **What changed**: Modified "Continue with Google" actions in Login and Signup flows to render a customized info notice instead of simulating successful access.
- **Why it changed**: Clarified that Google Authentication is a prototype interface component rather than an active OAuth credentials workflow.
- **Impact**: Injects a custom violet absolute toast indicating prototype bounds, cleanly preserving the primary username/password simulated login redirection actions.

## 2026-07-04T17:55:00+05:30
### Dashboard Application Layout Shell and Subroutes Implementation
- **What changed**: Implemented collapsible side navigation panel, persistent header bars containing mock searches and notification alerts, responsive hamburger overlays on mobile formats, and custom pages `/company`, `/founder`, `/documents`, `/decision`, `/history`, and `/settings`.
- **Why it changed**: Expanded workspace dashboards into a shared, robust application layout shell serving all route resources.
- **Impact**: Establishes high-fidelity templates carrying functional parameters: file managers equipped with drag-drop RAG upload hooks, filterable decision ledgers, interactive multi-agent debate trigger terminals, and editable consensus threshold range bars.

## 2026-07-04T18:20:00+05:30
### Polish Dashboard UX and Layout Overlap Resolution
- **What changed**: Disabled the theme switcher mockup button (forcing permanent dark mode), removed infinite pulse and ping animations (expert items status indicator and profile notification bells), corrected z-index properties across dropdown actions, drawer backdrops, and sidebar overlays, and converted the responsive sidebar transitions to layout-stable pure CSS selectors.
- **Why it changed**: Addressed UI issues regarding overlay containment boundaries, viewport layout shifts, and visual clutter from flashing indicators.
- **Impact**: Establishes a highly-polished, responsive UI system that prevents overlapping elements, ensures tooltips stay inside viewport limits, and guarantees consistent glassmorphism shadows without horizontal scrolling issues.

## 2026-07-04T18:25:00+05:30
### Refined TopNavbar Notifications Dropdown Visual Layout
- **What changed**: Sized notifications dropdown exactly to `w-[350px]` with `max-h-[350px]` and internal scroll bars, added a spacing offset of 14px under the navbar boundary bottom line, added rounded card borders, and configured click-away backdrops at z-index 40.
- **Why it changed**: Resolved visual layout issues where notifications overlapped primary dashboard grids or extended beyond view limits.
- **Impact**: Guarantees zero layout shifts and absolute overlay placement without obstructing dashboard card components.

---

# Future Improvements
- Integration of actual multi-agent websocket endpoints for running real-time debate sequences.
- Dynamic drag-and-drop document upload workspace in client dashboard.
- Live interactive charts rendered via Recharts or D3.

---

# Important TODOs
- [ ] Connect mockup dashboard actions to a simulated workspace sandbox.
- [ ] Bootstrap python agent server framework.
