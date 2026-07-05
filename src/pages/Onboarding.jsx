import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Building, Target, BookOpen, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { getSession, submitFounderOnboarding, submitCompanyOnboarding } from '../lib/api';

const ROLES = ['CEO', 'CTO', 'COO', 'Other'];
const STYLES = ['Conservative', 'Balanced', 'Aggressive'];
const CHALLENGES = ['Hiring', 'Finance', 'Fundraising', 'Product', 'Marketing', 'Sales', 'Operations'];
const STAGES = ['Idea', 'MVP', 'Early Revenue', 'Growth', 'Scaling', 'Enterprise'];
const FUNDING_STAGES = ['Bootstrapped', 'Pre Seed', 'Seed', 'Series A', 'Series B', 'Other'];
const GOALS = [
    'Increase Revenue', 'Reduce Burn', 'Raise Funding', 'Hire Employees', 'Expand Team',
    'Launch Product', 'Improve Marketing', 'Increase Customers', 'Enter New Market', 'Reduce Costs',
];
const NOTIFY = ['Email', 'In-app', 'None'];

const field = "w-full px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-white text-sm focus:border-violet-500 transition-all placeholder:text-gray-600";
const label = "text-[10px] font-bold text-gray-500 uppercase tracking-widest";

function Pills({ options, value, onChange, multi = false }) {
    const isActive = (o) => (multi ? value.includes(o) : value === o);
    const toggle = (o) => {
        if (!multi) return onChange(o);
        onChange(value.includes(o) ? value.filter((v) => v !== o) : [...value, o]);
    };
    return (
        <div className="flex flex-wrap gap-2">
            {options.map((o) => (
                <button
                    key={o}
                    type="button"
                    onClick={() => toggle(o)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all border ${isActive(o)
                        ? 'bg-violet-600/20 border-violet-500/50 text-violet-300'
                        : 'bg-white/[0.02] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                        }`}
                >
                    {o}
                </button>
            ))}
        </div>
    );
}

export default function Onboarding() {
    const navigate = useNavigate();
    const session = getSession();
    const [step, setStep] = useState(1);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    // Step 1 - founder
    const [role, setRole] = useState('CEO');
    const [years, setYears] = useState('');
    const [industryExp, setIndustryExp] = useState('');
    const [country, setCountry] = useState('India');
    const [tz, setTz] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata');
    const [language, setLanguage] = useState('English');
    const [style, setStyle] = useState('Balanced');
    const [challenge, setChallenge] = useState('Finance');
    const [notify, setNotify] = useState('Email');

    // Step 2 - company
    const [companyName, setCompanyName] = useState('');
    const [industry, setIndustry] = useState('');
    const [stage, setStage] = useState('MVP');
    const [teamSize, setTeamSize] = useState('');
    const [revenue, setRevenue] = useState('');
    const [expenses, setExpenses] = useState('');
    const [cash, setCash] = useState('');
    const [raised, setRaised] = useState('');
    const [fundingStage, setFundingStage] = useState('Bootstrapped');
    const [goals, setGoals] = useState([]);
    const [contextMemory, setContextMemory] = useState('');

    const runway = useMemo(() => {
        const burn = parseFloat(expenses) - (parseFloat(revenue) || 0);
        const cashNum = parseFloat(cash);
        if (!cashNum || !parseFloat(expenses)) return null;
        if (burn <= 0) return 'Profitable';
        return `${(cashNum / burn).toFixed(1)} months`;
    }, [cash, expenses, revenue]);

    if (!session) {
        navigate('/login');
        return null;
    }

    const submitStep1 = async (e) => {
        e.preventDefault();
        setError(null);
        if (!years || !industryExp.trim() || !country.trim()) return setError('Please fill in experience, industry, and country.');
        setSaving(true);
        try {
            await submitFounderOnboarding({
                founder_id: session.founder_id,
                role,
                years_experience: parseInt(years, 10),
                industry_experience: industryExp.trim(),
                country: country.trim(),
                timezone_name: tz,
                language,
                decision_style: style,
                biggest_challenge: challenge,
                notification_preference: notify,
            });
            setStep(2);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const submitStep2 = async (e) => {
        e.preventDefault();
        setError(null);
        if (!companyName.trim() || !industry.trim() || !teamSize || expenses === '' || cash === '') {
            return setError('Company name, industry, team size, expenses, and cash are required.');
        }
        setSaving(true);
        try {
            await submitCompanyOnboarding({
                founder_id: session.founder_id,
                name: companyName.trim(),
                industry: industry.trim(),
                stage,
                team_size: parseInt(teamSize, 10),
                monthly_revenue: parseFloat(revenue) || 0,
                monthly_expenses: parseFloat(expenses) || 0,
                cash_available: parseFloat(cash) || 0,
                funding_raised: parseFloat(raised) || 0,
                funding_stage: fundingStage,
                goals,
                context_memory: contextMemory,
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col items-center py-12 px-6 grid-bg">
            <div className="w-full max-w-2xl space-y-8">

                {/* Progress header */}
                <div className="text-center space-y-3">
                    <h1 className="text-3xl font-black tracking-tight">
                        Welcome, {session.full_name?.split(' ')[0]} 👋
                    </h1>
                    <p className="text-sm text-gray-400">
                        Two quick steps so your AI advisors know your business before you ask anything.
                    </p>
                    <div className="flex items-center justify-center gap-3 pt-2">
                        {[1, 2].map((n) => (
                            <div key={n} className={`h-1.5 w-24 rounded-full transition-all ${step >= n ? 'bg-gradient-to-r from-violet-500 to-blue-500' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium text-left">
                        {error}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.form
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={submitStep1}
                            className="glass-panel p-7 rounded-2xl border border-white/5 space-y-6 text-left"
                        >
                            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                <User className="h-4.5 w-4.5 text-violet-400" /> Founder Information
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <span className={label}>Full Name (from Google)</span>
                                    <input className={field} value={session.full_name} readOnly />
                                </div>
                                <div className="space-y-1.5">
                                    <span className={label}>Email (from Google)</span>
                                    <input className={field} value={session.email || 'linked to Google account'} readOnly />
                                </div>
                                <div className="space-y-1.5">
                                    <span className={label}>Years of Startup Experience</span>
                                    <input className={field} type="number" min="0" max="60" placeholder="e.g. 3" value={years} onChange={(e) => setYears(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <span className={label}>Industry Experience</span>
                                    <input className={field} placeholder="e.g. Fintech, SaaS" value={industryExp} onChange={(e) => setIndustryExp(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <span className={label}>Country</span>
                                    <input className={field} value={country} onChange={(e) => setCountry(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <span className={label}>Time Zone</span>
                                    <input className={field} value={tz} onChange={(e) => setTz(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <span className={label}>Preferred Language</span>
                                    <input className={field} value={language} onChange={(e) => setLanguage(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-2"><span className={label}>Founder Role</span><Pills options={ROLES} value={role} onChange={setRole} /></div>
                            <div className="space-y-2"><span className={label}>Decision Making Style</span><Pills options={STYLES} value={style} onChange={setStyle} /></div>
                            <div className="space-y-2"><span className={label}>Biggest Current Challenge</span><Pills options={CHALLENGES} value={challenge} onChange={setChallenge} /></div>
                            <div className="space-y-2"><span className={label}>Notification Preference</span><Pills options={NOTIFY} value={notify} onChange={setNotify} /></div>

                            <button type="submit" disabled={saving} className="w-full px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.01] transition-all disabled:opacity-50">
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue to Company <ArrowRight className="h-4 w-4" /></>}
                            </button>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={submitStep2}
                            className="glass-panel p-7 rounded-2xl border border-white/5 space-y-6 text-left"
                        >
                            <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                <Building className="h-4.5 w-4.5 text-violet-400" /> Company Information
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <span className={label}>Company Name</span>
                                    <input className={field} placeholder="e.g. VisionAI" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <span className={label}>Industry</span>
                                    <input className={field} placeholder="e.g. AI SaaS" value={industry} onChange={(e) => setIndustry(e.target.value)} />
                                </div>
                            </div>
                            <div className="space-y-2"><span className={label}>Startup Stage</span><Pills options={STAGES} value={stage} onChange={setStage} /></div>

                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 pt-2">Business Metrics</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <span className={label}>Team Size</span>
                                    <input className={field} type="number" min="1" placeholder="e.g. 8" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <span className={label}>Monthly Revenue</span>
                                    <input className={field} type="number" min="0" placeholder="e.g. 320000" value={revenue} onChange={(e) => setRevenue(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <span className={label}>Monthly Expenses (Burn)</span>
                                    <input className={field} type="number" min="0" placeholder="e.g. 500000" value={expenses} onChange={(e) => setExpenses(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <span className={label}>Cash Available</span>
                                    <input className={field} type="number" min="0" placeholder="e.g. 2000000" value={cash} onChange={(e) => setCash(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <span className={label}>Funding Raised</span>
                                    <input className={field} type="number" min="0" placeholder="e.g. 5000000" value={raised} onChange={(e) => setRaised(e.target.value)} />
                                </div>
                                <div className="space-y-1.5">
                                    <span className={label}>Runway (auto-calculated)</span>
                                    <div className={`${field} flex items-center gap-2 ${runway ? 'text-emerald-400 font-bold' : 'text-gray-600'}`}>
                                        {runway ? <><CheckCircle2 className="h-4 w-4" /> {runway}</> : 'Fill cash + expenses'}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2"><span className={label}>Funding Stage</span><Pills options={FUNDING_STAGES} value={fundingStage} onChange={setFundingStage} /></div>

                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 pt-2 flex items-center gap-1.5">
                                <Target className="h-4 w-4 text-violet-400" /> Business Goals <span className="text-gray-500 normal-case font-normal">(select all that apply)</span>
                            </h4>
                            <Pills options={GOALS} value={goals} onChange={setGoals} multi />

                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 pt-2 flex items-center gap-1.5">
                                <BookOpen className="h-4 w-4 text-violet-400" /> Company Context Memory
                            </h4>
                            <textarea
                                className={`${field} min-h-[140px] resize-none`}
                                placeholder="Tell your AI advisors everything: what the company does, mission, vision, products, target customers, current problems, important context. This becomes their long-term memory."
                                value={contextMemory}
                                onChange={(e) => setContextMemory(e.target.value)}
                            />

                            <div className="flex gap-3">
                                <button type="button" onClick={() => setStep(1)} className="px-6 py-3.5 rounded-xl bg-white/[0.03] border border-white/10 font-bold text-xs uppercase tracking-wider text-gray-300 hover:text-white transition-all">
                                    Back
                                </button>
                                <button type="submit" disabled={saving} className="flex-1 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.01] transition-all disabled:opacity-50">
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Enter the Decision Room <ArrowRight className="h-4 w-4" /></>}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
