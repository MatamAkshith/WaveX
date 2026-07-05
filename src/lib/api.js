// WaveX API client - single place the frontend talks to the backend.
// Backend must be running: cd backend && python -m uvicorn app.main:app --reload

const BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

async function req(path, opts = {}) {
    const res = await fetch(`${BASE}${path}`, opts);
    if (!res.ok) {
        let detail = res.statusText;
        try { detail = (await res.json()).detail || detail; } catch { /* noop */ }
        throw new Error(detail);
    }
    return res.json();
}

// The demo company is auto-created once and remembered in localStorage.
export async function ensureCompany() {
    const cached = localStorage.getItem('wavex_company_id');
    if (cached) return Number(cached);
    const company = await req('/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'WaveX Inc.',
            industry: 'AI Decision Intelligence',
            size: '11-50',
        }),
    });
    localStorage.setItem('wavex_company_id', String(company.id));
    return company.id;
}

export async function createDecision(question) {
    const companyId = await ensureCompany();
    return req('/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: question.slice(0, 80),
            context: 'Submitted from the WaveX dashboard.',
            question,
            company_id: companyId,
        }),
    });
}

export async function approveDecision(decisionId, approved, comments = null) {
    return req('/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision_id: decisionId, approved, comments }),
    });
}

export async function uploadDocument(file, domain = 'general') {
    const companyId = await ensureCompany();
    const form = new FormData();
    form.append('file', file);
    form.append('domain', domain);
    return req(`/company/${companyId}/documents`, { method: 'POST', body: form });
}

export async function listDocuments() {
    const companyId = await ensureCompany();
    return req(`/company/${companyId}/documents`);
}

export async function getHistory() {
    return req('/history');
}

// Guess a knowledge domain from the filename so the right expert finds it.
export function guessDomain(filename) {
    const n = filename.toLowerCase();
    if (/(financ|budget|runway|burn|revenue|cap_table|captable)/.test(n)) return 'finance';
    if (/(legal|bylaw|contract|compliance|policy|terms)/.test(n)) return 'legal';
    if (/(hiring|salary|recruit|offer|hr_)/.test(n)) return 'hiring';
    if (/(market|gtm|sales|growth|pitch)/.test(n)) return 'gtm';
    return 'general';
}

// ---------- Onboarding & auth (demo Google flow) ----------

export function getSession() {
    try { return JSON.parse(localStorage.getItem('wavex_session')) || null; } catch { return null; }
}

export function saveSession(session) {
    localStorage.setItem('wavex_session', JSON.stringify(session));
    if (session.company_id) localStorage.setItem('wavex_company_id', String(session.company_id));
}

export async function googleAuth(profile) {
    const res = await req('/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
    });
    saveSession(res);
    return res;
}

export async function submitFounderOnboarding(data) {
    return req('/onboarding/founder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

export async function submitCompanyOnboarding(data) {
    const res = await req('/onboarding/company', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    const session = getSession();
    if (session) saveSession({ ...session, onboarded: true, company_id: res.company_id });
    return res;
}

export async function getDashboardSummary() {
    const session = getSession();
    if (!session) return null;
    return req(`/founder/${session.founder_id}/summary`);
}
