import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Send,
    Bot,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
    ChevronRight,
    TrendingUp,
    Cpu,
    Loader2
} from 'lucide-react';

export default function AskDecision() {
    const [proposal, setProposal] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationStep, setSimulationStep] = useState(0);
    const [simulationLogs, setSimulationLogs] = useState([]);
    const [consensusResult, setConsensusResult] = useState(null);

    const mockSteps = [
        {
            agent: 'Finance AI',
            status: 'VERIFIED',
            message: 'Runway forecasts check. Net burn increments by $12K/month if approved. Calculated Runway remains sustainable at 10.4 months post-spend. Minimal risk.',
            sentiment: 'positive'
        },
        {
            agent: 'Hiring AI',
            status: 'ADVISED',
            message: 'Org capacity constraints. Recommended sourcing timeline is 45 days. Suggest pacing standard salary packages to control initial burn spikes.',
            sentiment: 'neutral'
        },
        {
            agent: 'Legal AI',
            status: 'WARNING',
            message: 'Compliance check. Ensure hiring contracts include proper IP assignment bylaws. In Delaware jurisdiction, contract formatting requirements apply.',
            sentiment: 'warning'
        },
        {
            agent: 'GTM AI',
            status: 'SUPPORTED',
            message: 'Customer Acquisition Cost optimization. New engineering bandwidth will directly reduce onboarding friction logs, driving higher trial-to-membership conversions.',
            sentiment: 'positive'
        }
    ];

    const handleSimulate = (e) => {
        e.preventDefault();
        if (!proposal.trim()) return;

        setIsSimulating(true);
        setSimulationStep(0);
        setSimulationLogs([]);
        setConsensusResult(null);

        // Simulate stepping through agents in sequence
        let currentStep = 0;
        const interval = setInterval(() => {
            if (currentStep < mockSteps.length) {
                setSimulationLogs(prev => [...prev, mockSteps[currentStep]]);
                setSimulationStep(currentStep + 1);
                currentStep++;
            } else {
                clearInterval(interval);
                // Formulate final Strategy recommendation consensus
                setConsensusResult({
                    recommendation: 'APPROVED WITH CONDITIONS',
                    confidence: '91%',
                    rationale: 'Strategic benefits to trial-to-paid conversion limits outweigh short-term salary burn levels. Enforce Legal counsel guidelines regarding IP assignment.'
                });
                setIsSimulating(false);
            }
        }, 1200);
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
                                placeholder="e.g. Should we increase seed funding spending limits by hiring three senior backend developers to speed up core deployment?"
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
                                        Simulating Debate Session...
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
                                Specialist AI agents evaluate risks matching your company's balance sheets and sector vectors.
                            </li>
                            <li className="flex items-start gap-2">
                                <ChevronRight className="h-4 w-4 flex-shrink-0 text-violet-500 mt-0.5" />
                                Veto overrides can only be approved by the registered Superuser credentials.
                            </li>
                        </ul>
                    </div>
                </div>

            </div>

        </motion.div>
    );
}
