# ml_track/mock_data.py

MOCK_COMPANY_CONTEXT = {
    "company_id": "test_001",
    "name": "TestCo",
    "stage": "Series A",
    "industry": "SaaS",
    "mrr": 80000,
    "runway_months": 11,
    "team_size": 8,
    "monthly_burn": 45000,
    "last_funding_amount": 2000000
}

MOCK_CHUNKS = {
    "finance": [
        "Startups with under 12 months runway should prioritize extending cash reserves before increasing burn.",
        "A burn multiple above 2x signals inefficient capital deployment for Series A companies.",
        "Founders should model at least two downside scenarios before committing to new fixed costs.",
        "Bridge financing becomes harder to raise once runway drops below 6 months."
    ],
    "hiring": [
        "Hiring during low-runway periods increases risk unless the role directly drives revenue.",
        "Engineering hires typically take 6-8 weeks to become fully productive.",
        "Series A companies average 1 new hire per $150k-$200k in new ARR.",
        "Contractors can bridge urgent skill gaps without long-term payroll commitment."
    ],
    "legal": [
        "Misclassifying contractors as employees carries significant compliance risk in most jurisdictions.",
        "Standard employment contracts should include IP assignment clauses.",
        "Equity grants to new hires should be reviewed against existing cap table dilution limits.",
        "Non-compete enforceability varies significantly by state and country."
    ],
    "gtm": [
        "Customer acquisition cost should be evaluated against LTV before scaling spend.",
        "Series A companies typically see growth plateau without dedicated GTM hires.",
        "Paid acquisition channels often show diminishing returns past a certain spend threshold.",
        "Founder-led sales can scale to roughly $1M ARR before requiring a dedicated sales hire."
    ]
}