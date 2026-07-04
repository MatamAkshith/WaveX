import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Sliders, CheckCircle2, Shield, Eye, Database } from 'lucide-react';

export default function SettingsPage() {
    const [toastMessage, setToastMessage] = useState(null);

    // Mock options state
    const [params, setParams] = useState({
        consensusThreshold: 80,
        financeVeto: true,
        hiringAggressive: false,
        vectorEncrypted: true
    });

    const handleSave = () => {
        setToastMessage('Workspace parameter updates saved successfully.');
        setTimeout(() => setToastMessage(null), 3000);
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
                        className="fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-400 font-medium text-sm shadow-xl backdrop-blur-md"
                    >
                        <CheckCircle2 className="h-4.5 w-4.5" />
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Page Header */}
            <div className="text-left space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-white">System Settings</h1>
                <p className="text-sm text-gray-400 font-normal">Configure consensus thresholds, active AI Specialist constraints, and vector DB parameters.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main form section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left space-y-6">

                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Sliders className="h-4.5 w-4.5 text-violet-400" />
                            Consensus Debate Parameters
                        </h3>

                        {/* Threshold slider */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-gray-400 font-semibold uppercase tracking-wide">Consensus Threshold Approval</span>
                                <span className="text-violet-300 font-bold text-sm">{params.consensusThreshold}% Confidence</span>
                            </div>
                            <input
                                type="range"
                                min="50"
                                max="95"
                                value={params.consensusThreshold}
                                onChange={(e) => setParams({ ...params, consensusThreshold: Number(e.target.value) })}
                                className="w-full h-1.5 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-violet-500 border border-white/[0.04]"
                            />
                            <p className="text-xs text-gray-500 font-normal leading-normal">
                                Minimum decision consensus value required before automated executive reports are approved.
                            </p>
                        </div>

                        <div className="h-px bg-white/5" />

                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Shield className="h-4.5 w-4.5 text-violet-400" />
                            Active AI Specialist Settings
                        </h3>

                        {/* Veto Switch */}
                        <div className="space-y-4">
                            <label className="flex items-start justify-between cursor-pointer group">
                                <div className="space-y-0.5 max-w-md">
                                    <span className="text-xs font-bold text-white tracking-wide">Enforce Finance AI Runway Veto</span>
                                    <p className="text-xs text-gray-500">
                                        If active runway forecast falls below 6 months post-expense, Finance AI automatically vetoes proposals.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={params.financeVeto}
                                    onChange={(e) => setParams({ ...params, financeVeto: e.target.checked })}
                                    className="rounded border-white/10 bg-white/[0.02] text-violet-600 focus:ring-offset-0 focus:ring-1 focus:ring-violet-500/30"
                                />
                            </label>

                            {/* Hiring Aggressive Switch */}
                            <label className="flex items-start justify-between cursor-pointer group">
                                <div className="space-y-0.5 max-w-md">
                                    <span className="text-xs font-bold text-white tracking-wide">Prioritize Aggressive Hiring Spans</span>
                                    <p className="text-xs text-gray-500">
                                        Gives Hiring AI model higher weights to clear developer constraints even under higher runway expenditure rates.
                                    </p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={params.hiringAggressive}
                                    onChange={(e) => setParams({ ...params, hiringAggressive: e.target.checked })}
                                    className="rounded border-white/10 bg-white/[0.02] text-violet-600 focus:ring-offset-0 focus:ring-1 focus:ring-violet-500/30"
                                />
                            </label>
                        </div>

                        <div className="h-px bg-white/5" />

                        {/* Ingestion privacy settings */}
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <Database className="h-4.5 w-4.5 text-violet-400" />
                            Ingestion Privacy Policies
                        </h3>

                        <label className="flex items-start justify-between cursor-pointer group">
                            <div className="space-y-0.5 max-w-md">
                                <span className="text-xs font-bold text-white tracking-wide">Enforce Local Node Encryption</span>
                                <p className="text-xs text-gray-500">
                                    Vector datasets remain entirely stored inside local browser memory indexes with no exterior requests.
                                </p>
                            </div>
                            <input
                                type="checkbox"
                                checked={params.vectorEncrypted}
                                onChange={(e) => setParams({ ...params, vectorEncrypted: e.target.checked })}
                                className="rounded border-white/10 bg-white/[0.02] text-violet-600 focus:ring-offset-0 focus:ring-1 focus:ring-violet-500/30"
                            />
                        </label>

                        <div className="pt-4 flex justify-end">
                            <button
                                onClick={handleSave}
                                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-violet-600/30 transition-all hover:scale-[1.01]"
                            >
                                Save Workspace Targets
                            </button>
                        </div>

                    </div>
                </div>

                {/* Info prompt */}
                <div className="space-y-6">
                    <div className="glass-panel p-5.5 rounded-2xl border border-white/5 shadow-xl text-left space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Settings className="h-4 w-4 text-violet-400" />
                            Consensus Thresholds
                        </h4>
                        <p className="text-xs text-gray-400 font-normal leading-relaxed">
                            Consensus threshold values adjust how aggressively strategy recomendations must align with financial and legal boundaries before getting signed off.
                        </p>
                    </div>
                </div>

            </div>

        </motion.div>
    );
}
