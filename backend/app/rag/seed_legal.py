"""
Local knowledge bases (judge feedback): legal + finance, seeded into
Chroma as corpus="global" — shared across ALL companies, unlike uploaded
documents which are private per company.

Knowledge agents (Legal, Finance) ground their analysis here.
Seeding is idempotent (upsert by stable IDs) and runs at API startup.
"""

import logging

from app.rag.store import get_collection

logger = logging.getLogger(__name__)

LEGAL_KNOWLEDGE = [
    (
        "incorporation",
        "Startup incorporation in India: A Private Limited Company under the Companies Act 2013 "
        "is the standard structure for venture-backed startups. Requires minimum 2 directors with "
        "DIN, MoA and AoA filed with the MCA. Foreign investors generally require a Pvt Ltd "
        "structure. LLPs are cheaper to maintain but unsuitable for issuing ESOPs or raising "
        "institutional capital. DPIIT Startup India recognition provides tax exemptions under "
        "Section 80-IAC and easier compliance for eligible startups.",
    ),
    (
        "founder_equity",
        "Founder equity and vesting: Founder shares should vest over 4 years with a 1-year cliff, "
        "documented in a Founders' Agreement covering equity split, roles, IP assignment, and exit "
        "clauses. Every founder must sign an IP assignment deed transferring all work product to "
        "the company — investors will check this in due diligence. A departing founder without "
        "vesting can retain a large dead-equity stake that blocks future fundraising.",
    ),
    (
        "esop",
        "ESOP policy: Standard ESOP pools are 10-15 percent of fully diluted equity. In India, "
        "ESOPs require board and shareholder approval and a scheme compliant with Companies Act "
        "Rule 12. Employees are taxed twice: as perquisite income at exercise, and capital gains "
        "at sale. DPIIT-recognized startups can defer the exercise tax by up to 5 years. Standard "
        "vesting is 4 years with a 1-year cliff; define good-leaver and bad-leaver terms upfront.",
    ),
    (
        "employment",
        "Employment law essentials: Written offer letters and employment agreements are mandatory "
        "practice, covering probation, notice period (typically 30-90 days), confidentiality, and "
        "IP assignment. PF registration is mandatory once headcount reaches 20; ESI below salary "
        "thresholds. Misclassifying employees as contractors to avoid statutory benefits creates "
        "retrospective liability for PF, gratuity, and penalties. Non-compete clauses are largely "
        "unenforceable in India post-employment, but confidentiality and non-solicit clauses are "
        "enforceable.",
    ),
    (
        "data_protection",
        "Data protection compliance: India's DPDP Act 2023 requires notice and consent for personal "
        "data processing, purpose limitation, breach notification to the Data Protection Board, and "
        "erasure on request. Penalties reach INR 250 crore. If serving EU users, GDPR also applies: "
        "lawful basis, data processing agreements with vendors, 72-hour breach notification, and "
        "potentially an EU representative. RBI mandates payment data be stored in India.",
    ),
    (
        "contracts",
        "Commercial contracts: Customer agreements should combine an MSA with SOWs or order forms. "
        "Key clauses to negotiate: limitation of liability (cap at 12 months of fees paid is market "
        "standard), indemnification scope, termination for convenience, auto-renewal, governing law "
        "and dispute resolution (arbitration seat). Never sign unlimited liability. SLAs should "
        "have defined remedies (service credits), not open-ended damages.",
    ),
    (
        "fundraising",
        "Fundraising legal terms: A term sheet covers valuation, liquidation preference (1x "
        "non-participating is founder-friendly market standard), anti-dilution (broad-based "
        "weighted average, avoid full ratchet), board composition, and founder vesting reset. "
        "Definitive documents are the SHA and SSA. In India, early rounds commonly use CCPS or "
        "convertible notes/iSAFE; priced rounds require a registered valuer report. Comply with "
        "Section 42 private placement rules — max 200 offerees per year.",
    ),
    (
        "intellectual_property",
        "Intellectual property: Register the trademark (company and product name) in relevant "
        "classes early — India is first-to-file. Code is protected by copyright automatically, but "
        "ensure all contributors (employees, freelancers, agencies) have signed IP assignments. "
        "Audit open-source dependencies: GPL/AGPL licenses can force disclosure of proprietary "
        "code, while MIT/Apache/BSD are permissive and safe for commercial use. Patents for "
        "software require a hardware/technical-effect angle in India.",
    ),
    (
        "compliance_calendar",
        "Ongoing compliance: Private limited companies must file GST returns (monthly/quarterly), "
        "TDS returns quarterly, hold at least 4 board meetings a year, file annual returns "
        "(AOC-4, MGT-7) with the ROC, and maintain statutory registers. Non-compliance attracts "
        "per-day penalties and director disqualification. Budget for a company secretary or "
        "compliance service from day one; cleanup during due diligence costs far more.",
    ),
]

FINANCE_KNOWLEDGE = [
    (
        "runway_benchmarks",
        "Runway and burn benchmarks: Healthy early-stage startups maintain 18-24 months of runway "
        "post-fundraise; below 12 months means fundraising mode should begin immediately. Burn "
        "multiple (net burn / net new ARR) under 1.5x is strong, over 3x signals inefficient "
        "growth. Default rule: any single commitment exceeding 10 percent of remaining runway "
        "deserves board-level scrutiny.",
    ),
    (
        "hiring_costs",
        "Hiring cost benchmarks: A senior engineer's fully loaded cost is roughly 1.25-1.4x base "
        "salary (payroll taxes, benefits, equipment, office). Recruiting fees run 15-25 percent of "
        "first-year salary via agencies. Engineering teams typically consume 50-70 percent of an "
        "early startup's burn. Rule of thumb: each senior hire shortens runway meaningfully at "
        "typical seed-stage burn levels.",
    ),
    (
        "unit_economics",
        "Unit economics benchmarks: LTV to CAC ratio of 3:1 or better is the standard SaaS health "
        "threshold; CAC payback under 12 months is strong, over 18 months is a warning sign. Gross "
        "margins for software should exceed 70 percent. Net revenue retention above 100 percent "
        "means expansion revenue outpaces churn — the single strongest predictor of durable growth.",
    ),
    (
        "fundraising_norms",
        "Fundraising norms: Seed rounds typically dilute founders 15-25 percent; Series A another "
        "15-20 percent. Raise for 18-24 months of milestones, not maximum valuation. Bridge rounds "
        "signal risk to future investors unless tied to clear milestones. Venture debt suits "
        "post-revenue companies wanting non-dilutive capital, but covenants restrict flexibility.",
    ),
]


def seed_global_knowledge() -> int:
    """Upsert the legal + finance knowledge bases into Chroma. Safe to run
    on every startup — stable IDs mean re-seeding overwrites, never duplicates."""
    collection = get_collection()

    ids = [f"legal_kb_{key}" for key, _ in LEGAL_KNOWLEDGE]
    ids += [f"finance_kb_{key}" for key, _ in FINANCE_KNOWLEDGE]
    documents = [text for _, text in LEGAL_KNOWLEDGE] + [text for _, text in FINANCE_KNOWLEDGE]
    metadatas = [
        {
            "corpus": "global",
            "company_id": -1,
            "domain": "legal",
            "source": f"Legal knowledge base - {key.replace('_', ' ')}",
            "kind": "knowledge",
        }
        for key, _ in LEGAL_KNOWLEDGE
    ] + [
        {
            "corpus": "global",
            "company_id": -1,
            "domain": "finance",
            "source": f"Finance knowledge base - {key.replace('_', ' ')}",
            "kind": "knowledge",
        }
        for key, _ in FINANCE_KNOWLEDGE
    ]

    collection.upsert(ids=ids, documents=documents, metadatas=metadatas)
    logger.info(f"Seeded {len(ids)} knowledge chunks (legal + finance, global corpus)")
    return len(ids)
