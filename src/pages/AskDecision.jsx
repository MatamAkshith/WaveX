import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Send,
    Bot,
    Sparkles,
    ChevronRight,
    Cpu,
    Loader2,
    History,
    CheckCircle2,
    XCircle,
    FileText
} from 'lucide-react';
import { createDecision, approveDecision } from '../lib/api';
import MetricsPanel from '../components/MetricsPanel';

const AGENT_META = {
    FinanceAgent: { label: 'Finance AI', status: 'VERIFIED', sentiment: 'positive' },
    HiringAgent: { label: 'Hiring AI', status: 'ADVISED', sentiment: 'neutral' },
    LegalAgent: { label: 'Legal AI', status: 'REVIEWED', sentiment: 'warning' },
    GTMAgent: { label: 'GTM AI', status: 'SUPPORTED', sentiment: 'positive' },
};

export default function AskDecision() {
    const [proposal, setProposal] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationLogs, setSimulationLogs] = useState([]);
    const [consensusResult, setConsensusResult] = useState(null);
    const [memoryHit, setMemoryHit] = useState(null);
    const [resolution, setResolution] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    const handleSimulate = async (e) => {
        e.preventDefault();
        if (!proposal.trim()) return;

        setIsSimulating(true);
        setSimulationLogs([]);
        setConsensusResult(null);
        setMemoryHit(null);
        setResolution(null);
        setErrorMsg(null);

        try {
            // Real call: Planner -> selected experts -> Judge -> Decision Ledger
            const decision = await createDecision(proposal.trim());

            if (decision.similar_past_decision) {
                setMemoryHit(decision.similar_past_decision);
            }

            // Reveal each real expert analysis one by one (keeps the drama)
            const logs = decision.expert_analyses.map((a) => {
                const meta = AGENT_META[a.agent_name] || { label: a.agent_name, status: 'ANALYZED', sentiment: 'neutral' };
                return {
                    agent: meta.label,
                    status: meta.status,
                    sentiment: meta.sentiment,
                    message: a.analysis,
                    recommendation: a.recommendation,
                    actionOutput: a.action_output,
                    keyInsights: a.key_insights || [],
                    metrics: a.metrics || {},
                    chartHints: a.chart_hints || {},
                    recommendations: a.recommendations || [],
                };
            });

            let i = 0;
            const interval = setInterval(() => {
                if (i < logs.length) {
                    const next = logs[i];
                    setSimulationLogs((prev) => [...prev, next]);
                    i++;
                } else {
                    clearInterval(interval);
                    const rec = decision.final_recommendation;
                    setConsensusResult({
                        decisionId: decision.id,
                        recommendation: rec.recommendation,
                        confidence: `${Math.round(rec.confidence * 100)}%`,
                        rationale: rec.why,
                        metrics: rec.metrics || {},
                        tradeOffs: rec.trade_offs || [],
                        nextSteps: rec.next_steps || [],
                    });
                    setIsSimulating(false);
                }
            }, 900);
        } catch (err) {
            setErrorMsg(`Backend unreachable or errored: ${err.message}. Is the API running on port 8000?`);
            setIsSimulating(false);
        }
    };

    const handleResolve = async (approved) => {
        if (!consensusResult) return;
        try {
            await approveDecision(consensusResult.decisionId, approved, approved ? 'Approved from dashboard' : 'Rejected from dashboard');
            setResolution(approved ? 'approved' : 'rejected');
        } catch (err) {
            setErrorMsg(`Could not record resolution: ${err.message}`);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-8"
        >
            {/* Page Header */}
            <div className="text-left space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-white">Ask Decision Engine</h1>
                <p className="text-sm text-gray-400 font-normal">Input corporate choices to trigger multi-agent consensus debates and generate resolved recommendations.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Proposal Builder and simulation */}
                <div className="lg:col-span-2 space-y-6">

                    <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left space-y-5">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Sparkles className="h-4.5 w-4.5 text-violet-400" />
                            Propose Strategic Question Schema
                        </h3>

                        <form onSubmit={handleSimulate} className="space-y-4">
                            <textarea
                                placeholder="e.g. Should we hire 5 senior engineers this quarter given our runway and hiring budget?"
                                value={proposal}
                                onChange={(e) => setProposal(e.target.value)}
                                disabled={isSimulating}
                                className="w-full px-4.5 py-4 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-white text-sm min-h-[120px] resize-none focus:border-violet-500 transition-all font-normal placeholder:text-gray-600"
                            />

                            <button
                                type="submit"
                                disabled={isSimulating || !proposal.trim()}
                                className="relative group overflow-hidden px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-violet-600/30 transition-all hover:scale-[1.01] flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
                            >
                                {isSimulating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Consulting Specialist Agents...
                                    </>
                                ) : (
                                    <>
                                        Run Consensus Engine
                                        <Send className="h-3.5 w-3.5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Error state */}
                    {errorMsg && (
                        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium text-left">
                            {errorMsg}
                        </div>
                    )}

                    {/* DECISION MEMORY banner */}
                    <AnimatePresence>
                        {memoryHit && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left flex items-start gap-3"
                            >
                                <History className="h-4.5 w-4.5 text-amber-400 flex-shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">Decision memory</span>
                                    <p className="text-xs text-amber-100/90 leading-relaxed font-normal">
                                        You faced a similar decision <span className="font-bold">{memoryHit.days_ago === 0 ? 'earlier today' : `${memoryHit.days_ago} days ago`}</span> —
                                        &ldquo;{memoryHit.title}&rdquo; was <span className="font-bold uppercase">{memoryHit.status}</span>.
                                        The Judge has re-evaluated in light of that outcome and the time elapsed.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Simulation Output Area */}
                    {(isSimulating || simulationLogs.length > 0) && (
                        <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left space-y-5">
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Cpu className="h-4 w-4 text-violet-400" />
                                Active Specialist Consensus Stream
                            </h3>

                            <div className="space-y-4">
                                {simulationLogs.map((log, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2.5">
                                                <div className="h-6 w-6 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-violet-400">
                                                    <Bot className="h-3.5 w-3.5" />
                                                </div>
                                                <span className="text-xs font-bold text-white tracking-wide">{log.agent}</span>
                                            </div>

                                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold tracking-wider ${log.sentiment === 'positive'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                    : log.sentiment === 'warning'
                                                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                }`}>
                                                {log.status}
                                            </span>
                                        </div>

                                        <p className="text-xs text-gray-400 leading-relaxed font-normal">{log.message}</p>

                                        {log.recommendation && (
                                            <p className="text-xs text-gray-300 leading-relaxed font-medium">
                                                <span className="text-violet-400 font-bold">Position:</span> {log.recommendation}
                                            </p>
                                        )}

                                        {log.actionOutput && (
                                            <div className="mt-2 p-3 rounded-lg bg-violet-950/20 border border-violet-500/20 space-y-1">
                                                <div className="flex items-center gap-1.5 text-[9px] font-extrabold text-violet-300 uppercase tracking-wider">
                                                    <FileText className="h-3 w-3" />
                                                    Deliverable produced by this agent
                                                </div>
                                                <p className="text-[11px] text-gray-300 leading-relaxed whitespace-pre-wrap font-normal">{log.actionOutput}</p>
                                            </div>
                                        )}

                                        {log.keyInsights.length > 0 && (
                                            <ul className="space-y-1 pt-1">
                                                {log.keyInsights.map((ins, i) => (
                                                    <li key={i} className="text-[11px] text-gray-400 flex gap-1.5">
                                                        <span className="text-violet-400 font-bold">›</span> {ins}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}

                                        <MetricsPanel metrics={log.metrics} hints={log.chartHints} />
                                    </motion.div>
                                ))}
                            </div>

                            {/* Complete Consensus Result Card */}
                            <AnimatePresence>
                                {consensusResult && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-5.5 rounded-xl bg-gradient-to-tr from-violet-950/20 to-blue-950/20 border border-violet-500/30 space-y-3.5"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-0.5">
                                                <span className="text-[9px] font-extrabold text-violet-300 uppercase tracking-wider">Strategy consensus resolution</span>
                                                <h4 className="text-base font-black text-white">{consensusResult.recommendation}</h4>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[9px] font-extrabold text-violet-300 uppercase tracking-wider">Consensus confidence</span>
                                                <h4 className="text-base font-black text-emerald-400">{consensusResult.confidence}</h4>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-300 leading-relaxed font-normal">{consensusResult.rationale}</p>

                                        {consensusResult.tradeOffs.length > 0 && (
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-extrabold text-violet-300 uppercase tracking-wider">Trade-offs</span>
                                                {consensusResult.tradeOffs.map((t, i) => (
                                                    <p key={i} className="text-xs text-gray-400 font-normal">• {t}</p>
                                                ))}
                                            </div>
                                        )}

                                        {consensusResult.nextSteps.length > 0 && (
                                            <div className="space-y-1">
                                                <span className="text-[9px] font-extrabold text-violet-300 uppercase tracking-wider">Next steps</span>
                                                {consensusResult.nextSteps.map((s, i) => (
                                                    <p key={i} className="text-xs text-gray-400 font-normal">{i + 1}. {s}</p>
                                                ))}
                                            </div>
                                        )}

                                        <MetricsPanel metrics={consensusResult.metrics} hints={{ overall_risk: 'gauge', overall_confidence: 'progress_ring', advisor_consensus: 'progress_ring', decision: 'label' }} />

                                        {/* Founder resolution: writes to the Decision Ledger + memory */}
                                        {resolution ? (
                                            <div className={`flex items-center gap-2 text-xs font-bold ${resolution === 'approved' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {resolution === 'approved' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                                Decision {resolution} and stored in organizational memory.
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-3 pt-1">
                                                <button
                                                    onClick={() => handleResolve(true)}
                                                    className="px-4 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-600/30 transition-all flex items-center gap-1.5"
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleResolve(false)}
                                                    className="px-4 py-2 rounded-lg bg-rose-600/20 border border-rose-500/40 text-rose-300 font-bold text-[10px] uppercase tracking-wider hover:bg-rose-600/30 transition-all flex items-center gap-1.5"
                                                >
                                                    <XCircle className="h-3.5 w-3.5" /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                </div>

                {/* Action Panel sidebar constraints Info */}
                <div className="space-y-6">
                    <div className="glass-panel p-5.5 rounded-2xl border border-white/5 shadow-xl text-left space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Brain className="h-4 w-4 text-violet-400" />
                            Consensus Debate Parameters
                        </h4>
                        <ul className="space-y-2.5 text-xs text-gray-400 font-normal leading-relaxed">
                            <li className="flex items-start gap-2">
                                <ChevronRight className="h-4 w-4 flex-shrink-0 text-violet-500 mt-0.5" />
                                The Planner selects only the specialist agents relevant to your question — legal questions go to Legal, not everyone.
                            </li>
                            <li className="flex items-start gap-2">
                                <ChevronRight className="h-4 w-4 flex-shrink-0 text-violet-500 mt-0.5" />
                                Experts ground their analysis in your uploaded documents and the local knowledge bases, citing sources by name.
                            </li>
                            <li className="flex items-start gap-2">
                                <ChevronRight className="h-4 w-4 flex-shrink-0 text-violet-500 mt-0.5" />
                                Every advisor also returns structured metrics — the charts you see are generated from those numbers, not by the AI.
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

        </motion.div>
    );
}
