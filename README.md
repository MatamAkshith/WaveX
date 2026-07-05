<div align="center">

# 🚀 WaveX – AI Founder Decision Room

### *Your AI Executive Boardroom for Smarter Startup Decisions*

An intelligent multi-agent decision support platform that helps startup founders make informed business decisions by consulting specialized AI advisors across Finance, HR, Legal, and Go-To-Market strategy.

---

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-green?logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)
![ChromaDB](https://img.shields.io/badge/ChromaDB-VectorDB-orange)
![LLM](https://img.shields.io/badge/LLM-AI-purple)
![License](https://img.shields.io/badge/License-MIT-yellow)

</div>

---

# 📖 Problem Statement

Startup founders wear multiple hats.

Every day they make decisions involving:

- 💰 Finance
- 👥 Hiring
- ⚖️ Legal
- 📈 Marketing
- 🚀 Growth Strategy

Most founders either:

- Consult multiple experts (expensive & time consuming)
- Or ask a generic AI chatbot that gives a single response.

However...

Real business decisions require **multiple perspectives** before reaching a conclusion.

---

# 💡 Our Solution

WaveX introduces the concept of an **AI Founder Decision Room**.

Instead of providing one generic AI answer, our platform simulates an executive board meeting where specialized AI advisors independently analyze a business problem.

Finally, a Judge Advisor combines all perspectives into one transparent recommendation while keeping the founder completely in control.

---

# 🎯 Key Features

✅ Google Authentication

✅ Founder & Company Onboarding

✅ Personalized Organizational Memory

✅ AI Planner

✅ Finance Advisor

✅ HR Advisor

✅ Legal Advisor

✅ GTM / Marketing Advisor

✅ Judge Advisor

✅ Decision Approval Workflow

✅ Decision Ledger

✅ Context-Aware Recommendations

---

# 🏗 System Architecture

```text
                   Founder

                      │

                      ▼

              React Frontend

                      │

                      ▼

             FastAPI Backend

                      │

                      ▼

             Planner (Router)

                      │

      ┌───────────────┼────────────────┐

      ▼               ▼                ▼

 Finance Advisor   HR Advisor    Legal Advisor

                      │

                      ▼

             GTM Advisor (if required)

                      │

                      ▼

              Judge Advisor

                      │

                      ▼

         Final Recommendation

                      │

          Approve / Reject Decision

                      │

                      ▼

            Decision Ledger

```

---

# 🔄 Complete Workflow

## Step 1 — Authentication

The founder signs in securely using Google Authentication.

If the founder is new, onboarding begins.

Otherwise, the dashboard opens directly.

---

## Step 2 — Founder Onboarding

The founder provides:

- Personal Information
- Role
- Startup Experience
- Decision Style
- Current Challenges

---

## Step 3 — Company Onboarding

The company profile includes:

- Company Name
- Startup Stage
- Team Size
- Revenue
- Burn Rate
- Runway
- Funding Details
- Business Goals
- AI Executive Brief

All information is stored securely inside PostgreSQL.

---

## Step 4 — Organizational Memory

Instead of asking the founder for company information every time,

WaveX automatically retrieves:

- Founder Profile
- Company Profile
- Business Metrics
- Strategic Goals
- Executive Brief
- Previous Decisions

This becomes the AI's long-term organizational memory.

---

## Step 5 — Founder asks a Question

Example

> Should I hire another Backend Developer?

---

## Step 6 — Planner

The Planner analyzes the intent.

Instead of answering,

it routes the question to relevant advisors.

Example

```
Finance Advisor

+

HR Advisor
```

---

## Step 7 — Advisors

Each advisor works independently.

### Finance Advisor

Analyzes

- Revenue
- Burn Rate
- Runway
- Hiring Cost

---

### HR Advisor

Analyzes

- Team Size
- Hiring Need
- Growth

---

### Legal Advisor

Analyzes

- Compliance
- Agreements
- Legal Risks

---

### GTM Advisor

Analyzes

- Marketing
- Customer Growth
- Product Positioning

---

## Step 8 — Judge Advisor

The Judge Advisor

does **NOT** simply pick one answer.

Instead it:

- Compares advisor recommendations
- Identifies agreements
- Detects trade-offs
- Creates one structured recommendation

---

## Step 9 — Founder Decision

The founder reviews the recommendation.

Options

✅ Approve

❌ Reject

---

## Step 10 — Decision Ledger

Approved decisions are permanently stored.

The platform gradually learns organizational history and future recommendations become increasingly personalized.

---

# 🧠 AI Architecture

WaveX follows a modular AI Agent architecture.

```text
Founder Question

        │

        ▼

Planner

        │

        ▼

Relevant Advisors

        │

        ▼

Context Injection

        │

        ▼

LLM

        │

        ▼

Judge Advisor

        │

        ▼

Recommendation
```

Our intelligence comes from

- Agent Orchestration
- Prompt Engineering
- Organizational Memory
- Business Logic

rather than custom model training.

---

# 🧩 Technology Stack

## Frontend

- React
- TypeScript
- Tailwind CSS
- Vite

---

## Backend

- FastAPI
- Python

---

## Database

- PostgreSQL

Stores

- Founder Information
- Company Information
- Business Metrics
- Decision Ledger

---

## Vector Database

ChromaDB

Stores

- Organizational Memory
- Company Knowledge
- Executive Brief
- Retrieved Context

---

## AI Layer

- Gemini / Claude / OpenAI
- Prompt Engineering
- Advisor Routing

---

## Authentication

Google OAuth

---

# 🗄 Database Design

### Founder

- Name
- Email
- Role
- Experience

---

### Company

- Startup Stage
- Revenue
- Burn Rate
- Funding
- Goals

---

### Decision Ledger

- Question
- Advisors Used
- Recommendation
- Status
- Timestamp

---

### Organizational Memory

- Executive Brief
- Company Context
- Long-Term Knowledge

---

# 📁 Project Structure

```
WaveX

│

├── frontend

│ ├── components

│ ├── pages

│ ├── hooks

│ └── services

│

├── backend

│ ├── api

│ ├── planner

│ ├── advisors

│ │ ├── finance

│ │ ├── hr

│ │ ├── legal

│ │ └── gtm

│ ├── database

│ ├── prompts

│ └── utils

│

├── docs

├── assets

└── README.md
```

---

# ⚙ Why Multiple Advisors?

Instead of generating one generic response,

WaveX separates business reasoning into specialized domains.

This provides

- Better transparency
- Modular architecture
- Easier maintenance
- Domain-specific reasoning

---

# 📈 Why ChromaDB?

We selected ChromaDB because

- Lightweight
- Open Source
- Local Development
- Easy Python Integration
- Perfect for Hackathon MVP

For enterprise-scale deployment,

the architecture can seamlessly migrate to managed vector databases like Pinecone.

---

# 🚀 Future Scope

- Live RAG
- Slack Integration
- Gmail Integration
- Calendar Integration
- Investor Reports
- Financial Forecasting
- CRM Integration
- ERP Integration
- Multi-Company Workspace
- Mobile Application

---

# 👥 Team

WaveX Development Team

- Backend & AI
- Frontend
- Database
- UI/UX

---

# 🏆 Vision

> "Chatbots answer questions.

> WaveX helps founders make decisions."

We believe AI should not replace founders.

It should empower them.

WaveX creates a transparent executive decision room where every important business decision is supported by specialized AI advisors.

---

<div align="center">

### ⭐ If you like this project, don't forget to star the repository!

Built with ❤️ during a 36-Hour AI Hackathon.

</div>
