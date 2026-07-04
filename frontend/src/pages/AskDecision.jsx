import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    Send,
    Bot,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    ChevronRight,
    Cpu,
    Loader2,
    Clock
} from 'lucide-react';
import { useDecision } from '../hooks/useDecision';

export default function AskDecision() {
    const [proposal, setProposal] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationStep, setSimulationStep] = useState(0);
    const [consensusResult, setConsensusResult] = useState(null);

    const { createDecision, getDecisionDetails, loading: apiLoading, error: apiError } = useDecision();
    const [toastMessage, setToastMessage] = useState(null);

    // Timeline state representation
    const [timeline, setTimeline] = useState([
        { id: 'planner', name: 'Planner', status: 'waiting', label: 'Waiting...' },
        { id: 'finance', name: 'Finance', status: 'waiting', label: 'Waiting...' },
        { id: 'hiring', name: 'Hiring', status: 'waiting', label: 'Waiting...' },
        { id: 'judge', name: 'Judge', status: 'waiting', label: 'Pending...' }
    ]);

    const handleSimulate = async (e) => {
        e.preventDefault();
        if (!proposal.trim()) return;

        setIsSimulating(true);
        setSimulationStep(0);
        setConsensusResult(null);

        // Reset timeline to initial state
        setTimeline([
            { id: 'planner', name: 'Planner', status: 'running', label: 'Running...' },
            { id: 'finance', name: 'Finance', status: 'waiting', label: 'Waiting...' },
            { id: 'hiring', name: 'Hiring', status: 'waiting', label: 'Waiting...' },
            { id: 'judge', name: 'Judge', status: 'pending', label: 'Pending...' }
        ]);

        try {
            // 1. POST request to initiate decision pipeline
            const initResponse = await createDecision('dummy-company-uuid-12345', proposal);
            const decisionId = initResponse.decision_id;

            // 2. Sequential UI step simulation to mimic multi-agent consensus pipeline
            const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

            // Step 1: Planner Done, Finance Running
            await delay(1200);
            setTimeline([
                { id: 'planner', name: 'Planner', status: 'done', label: 'Done' },
                { id: 'finance', name: 'Finance', status: 'running', label: 'Running...' },
                { id: 'hiring', name: 'Hiring', status: 'waiting', label: 'Waiting...' },
                { id: 'judge', name: 'Judge', status: 'pending', label: 'Pending...' }
            ]);

            // Step 2: Finance Done, Hiring Running
            await delay(1200);
            setTimeline([
                { id: 'planner', name: 'Planner', status: 'done', label: 'Done' },
                { id: 'finance', name: 'Finance', status: 'done', label: 'Done' },
                { id: 'hiring', name: 'Hiring', status: 'running', label: 'Running...' },
                { id: 'judge', name: 'Judge', status: 'pending', label: 'Pending...' }
            ]);

            // Step 3: Hiring Done, Judge Running
            await delay(1200);
            setTimeline([
                { id: 'planner', name: 'Planner', status: 'done', label: 'Done' },
                { id: 'finance', name: 'Finance', status: 'done', label: 'Done' },
                { id: 'hiring', name: 'Hiring', status: 'done', label: 'Done' },
                { id: 'judge', name: 'Judge', status: 'running', label: 'Running...' }
            ]);

            // Step 4: Judge Done, fetch final output from server
            await delay(1200);
            setTimeline([
                { id: 'planner', name: 'Planner', status: 'done', label: 'Done' },
                { id: 'finance', name: 'Finance', status: 'done', label: 'Done' },
                { id: 'hiring', name: 'Hiring', status: 'done', label: 'Done' },
                { id: 'judge', name: 'Judge', status: 'done', label: 'Done' }
            ]);

            // 3. GET request to fetch final resolved details
            const details = await getDecisionDetails(decisionId);

            // Let timeline stay in done state for 500ms before showing final layout
            await delay(500);

            setConsensusResult(details);
            setIsSimulating(false);
        } catch (err) {
            console.error(err);
            setToastMessage(err instanceof Error ? err.message : 'Error executing decision engine.');
            setTimeout(() => setToastMessage(null), 4000);
            setIsSimulating(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'done':
                return (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-5 w-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400"
                    >
                        <CheckCircle2 className="h-3 w-3" />
                    </motion.div>
                );
            case 'running':
                return (
                    <div className="relative h-5 w-5 flex items-center justify-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                            className="h-5 w-5 rounded-full border-2 border-violet-500 border-t-transparent"
                        />
                    </div>
                );
            case 'waiting':
                return (
                    <div className="h-5 w-5 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
                        <Clock className="h-3 w-3 animate-pulse" />
                    </div>
                );
            default: // pending
                return (
                    <div className="h-5 w-5 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center text-gray-700">
                        <Clock className="h-3 w-3" />
                    </div>
                );
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'done':
                return 'text-emerald-400 font-bold';
            case 'running':
                return 'text-violet-400 font-semibold';
            case 'waiting':
                return 'text-gray-400 font-normal';
            default:
                return 'text-gray-600 font-light';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-8"
        >
            {/* Toast Alert */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 font-medium text-sm shadow-xl backdrop-blur-md"
                    >
                        <AlertCircle className="h-4.5 w-4.5" />
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>

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
                                className="relative group overflow-hidden px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-violet-600/30 transition-all hover:scale-[1.01] flex items-center gap-2 disabled:opacity-50 disabled:scale-100 cursor-pointer"
                            >
                                {isSimulating ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Running Pipeline...
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

                    {/* Timeline Animation Stage (High Priority) */}
                    {isSimulating && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="glass-panel p-6 rounded-2xl border border-white/5 text-left space-y-6"
                        >
                            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                <Cpu className="h-4 w-4 text-violet-400 animate-pulse" />
                                Multi-Agent Consensus Stream Pipeline
                            </h3>

                            <div className="space-y-5 pl-2 relative border-l border-white/5 ml-3">
                                {timeline.map((step, idx) => (
                                    <motion.div
                                        key={step.id}
                                        layout
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="flex items-center gap-4 relative"
                                    >
                                        {/* Timeline Dot wrapper */}
                                        <div className="absolute -left-[19px] bg-[#0B0B0B] py-0.5">
                                            {getStatusIcon(step.status)}
                                        </div>

                                        <div className="flex-1 flex justify-between items-center bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3.5 ml-4 transition-all">
                                            <span className="text-xs font-bold text-white tracking-wide">{step.name} Stage</span>
                                            <span className={`text-[10px] uppercase tracking-wider ${getStatusStyle(step.status)}`}>
                                                {step.status === 'running' && '🔄 '}
                                                {step.status === 'done' && '✅ '}
                                                {step.status === 'waiting' && '⏳ '}
                                                {step.status === 'pending' && '⏳ '}
                                                {step.label}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Consensus Result Card */}
                    <AnimatePresence>
                        {consensusResult && !isSimulating && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-panel p-6 rounded-2xl border border-white/5 text-left space-y-6"
                            >
                                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                    <Cpu className="h-4 w-4 text-violet-400" />
                                    Resolved Consensus Recommendation
                                </h3>

                                <div className="p-5.5 rounded-xl bg-gradient-to-tr from-violet-950/20 to-blue-950/20 border border-violet-500/30 space-y-3.5">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-extrabold text-violet-300 uppercase tracking-wider">Strategy consensus resolution</span>
                                            <h4 className="text-base font-black text-white">{consensusResult.recommendation}</h4>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-extrabold text-violet-300 uppercase tracking-wider">Consensus confidence</span>
                                            <h4 className="text-base font-black text-emerald-400">
                                                {(consensusResult.confidence * 100).toFixed(0)}%
                                            </h4>
                                        </div>
                                    </div>

                                    {consensusResult.experts && consensusResult.experts.length > 0 && (
                                        <div className="space-y-3 pt-2">
                                            <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider">Agent Evaluation Details</span>
                                            <div className="grid grid-cols-1 gap-2.5">
                                                {consensusResult.experts.map((exp, idx) => (
                                                    <div key={idx} className="p-3.5 rounded-lg bg-black/40 border border-white/5 space-y-1">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs font-bold text-violet-300">{exp.agent_name}</span>
                                                            <span className="px-2 py-0.5 rounded text-[8px] font-bold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                                VERIFIED
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-400 font-normal leading-relaxed">{exp.analysis}</p>
                                                        <p className="text-[10px] text-gray-500 italic">Recommendation: {exp.recommendation}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {consensusResult.next_steps && consensusResult.next_steps.length > 0 && (
                                        <div className="space-y-1.5 pt-2">
                                            <span className="text-[9px] font-extrabold text-gray-500 uppercase tracking-wider">Resolved Next Steps</span>
                                            <ul className="space-y-1 text-xs text-gray-300 pl-4 list-disc">
                                                {consensusResult.next_steps.map((step, idx) => (
                                                    <li key={idx} className="font-normal">{step}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

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
