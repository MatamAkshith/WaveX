import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    AlertTriangle,
    Lightbulb,
    ArrowRight,
    TrendingDown,
    Percent,
    CheckCircle2,
    Users,
    Compass,
    DollarSign,
    Layers,
    Scale,
    Sparkles,
    PieChart
} from 'lucide-react';

export default function DashboardMockup() {
    const [selectedExpert, setSelectedExpert] = useState('Strategy AI');

    const experts = [
        { name: 'Strategy AI', role: 'Growth Strategy', status: 'Debating', icon: Compass, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        { name: 'Finance AI', role: 'Runway & Burn', status: 'Ready', icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
        { name: 'Hiring AI', role: 'Org Expansion', status: 'Ready', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { name: 'Legal AI', role: 'Compliance', status: 'Optimizing', icon: Scale, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { name: 'GTM AI', role: 'Acquisition & Market', status: 'Ready', icon: Layers, color: 'text-pink-400', bg: 'bg-pink-500/10' },
        { name: 'Product AI', role: 'Feature Prioritization', status: 'Analyzing', icon: Sparkles, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    ];

    const Sparkline = ({ points, color }) => {
        const width = 120;
        const height = 40;
        const maxVal = Math.max(...points);
        const minVal = Math.min(...points);
        const range = maxVal - minVal;

        // Scale points to fit SVG box
        const coordinates = points.map((p, index) => {
            const x = (index / (points.length - 1)) * width;
            const y = height - ((p - minVal) / (range || 1)) * (height - 8) - 4;
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg width={width} height={height} className="overflow-visible">
                <defs>
                    <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path
                    d={`M 0,${height} L ${coordinates} L ${width},${height} Z`}
                    fill={`url(#grad-${color})`}
                />
                <polyline
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    points={coordinates}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    };

    return (
        <div className="relative w-full max-w-2xl mx-auto">
            {/* Floating abstract aura lights */}
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-violet-600/20 blur-3xl pointer-events-none rounded-full" />
            <div className="absolute -bottom-12 -right-12 w-72 h-72 bg-blue-600/15 blur-3xl pointer-events-none rounded-full" />

            {/* Main glass frame */}
            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
                className="w-full glass-panel gradient-border rounded-2xl overflow-hidden shadow-2xl shadow-black/80"
            >
                {/* Window controls header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5 bg-white/[0.01]">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/20" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500/30 border border-yellow-500/20" />
                        <span className="w-3 h-3 rounded-full bg-green-500/30 border border-green-500/20" />
                    </div>
                    <div className="text-[11px] font-medium tracking-wide text-gray-500 uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        WaveX Workspace
                    </div>
                    <div className="w-12 h-1" />
                </div>

                {/* Workspace Body */}
                <div className="p-5 flex flex-col gap-5">
                    {/* Top Row: Metrics & Confidence Score */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        {/* Core Metrics */}
                        <div className="col-span-2 grid grid-cols-2 gap-3">
                            <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col justify-between">
                                <div>
                                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block">Active Runway</span>
                                    <span className="text-xl font-bold text-white mt-1 block">18.4 Months</span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-2.5">
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">Optimized</span>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col justify-between">
                                <div>
                                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block">Monthly Burn</span>
                                    <span className="text-xl font-bold text-white mt-1 block">$42,500</span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-2.5">
                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 font-semibold border border-sky-500/20">Under Budget</span>
                                </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col justify-between">
                                <div>
                                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block">MRR Growth</span>
                                    <span className="text-xl font-bold text-white mt-1 block">$124,800</span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-2 text-emerald-400 text-xs font-semibold">
                                    <TrendingUp className="h-3 w-3" /> +14.2% MoM
                                </div>
                            </div>

                            <div className="p-3.5 rounded-xl bg-white/[0.01] border border-white/5 flex flex-col justify-between">
                                <div>
                                    <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest block">LTV / CAC</span>
                                    <span className="text-xl font-bold text-white mt-1 block">4.8x ratio</span>
                                </div>
                                <div className="flex items-center gap-1.5 mt-2 text-violet-400 text-xs font-semibold">
                                    <PieChart className="h-3 w-3" /> Target 5.0x
                                </div>
                            </div>
                        </div>

                        {/* Confidence Score Display */}
                        <div className="rounded-xl bg-gradient-to-br from-violet-900/30 to-blue-900/10 p-4 border border-violet-500/20 flex flex-col justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/15 rounded-full blur-2xl pointer-events-none" />
                            <div>
                                <span className="text-[11px] font-semibold text-violet-300 uppercase tracking-wider block">Decision Index</span>
                                <span className="text-4xl font-extrabold text-white mt-1 tracking-tight">92%</span>
                                <span className="text-[11px] text-violet-200/70 block mt-1">High Confidence recommendation</span>
                            </div>
                            <div className="mt-4">
                                <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '92%' }}
                                        transition={{ duration: 1.2, delay: 0.3 }}
                                        className="h-full bg-gradient-to-r from-violet-500 to-blue-400 rounded-full"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Core Decision Engine Section */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                        {/* Experts Stack List (Left Side) */}
                        <div className="md:col-span-5 flex flex-col gap-2.5">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 px-1">Specialists Board</span>
                            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-1">
                                {experts.map((exp) => {
                                    const Icon = exp.icon;
                                    const isSelected = selectedExpert === exp.name;
                                    return (
                                        <button
                                            key={exp.name}
                                            onClick={() => setSelectedExpert(exp.name)}
                                            className={`flex items-center justify-between p-2.5 rounded-lg border text-left transition-all duration-200 ${isSelected
                                                    ? 'bg-white/10 border-white/15 shadow-md shadow-black/20'
                                                    : 'bg-white/[0.01] border-white/5 hover:bg-white/[0.03]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`p-1.5 rounded-md ${exp.bg} ${exp.color}`}>
                                                    <Icon className="h-3.5 w-3.5" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-semibold text-white">{exp.name}</p>
                                                    <p className="text-[9px] text-gray-400">{exp.role}</p>
                                                </div>
                                            </div>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${exp.status === 'Ready'
                                                    ? 'bg-emerald-500/10 text-emerald-400'
                                                    : exp.status === 'Debating'
                                                        ? 'bg-violet-500/10 text-violet-400 animate-pulse'
                                                        : 'bg-amber-500/10 text-amber-400'
                                                }`}>
                                                {exp.status}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* AI Decision Report (Right Side) */}
                        <div className="md:col-span-7 flex flex-col justify-between p-4 rounded-xl bg-white/[0.01] border border-white/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-3 self-end pointer-events-none opacity-40">
                                <Sparkles className="h-5 w-5 text-indigo-400" />
                            </div>

                            <div>
                                <div className="flex items-center gap-2 border-b border-white/5 pb-2.5 mb-2.5">
                                    <div className="h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
                                    <span className="text-xs font-bold text-white tracking-wide">Synthesis Report: Market Expansion</span>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                            <CheckCircle2 className="h-3 w-3 text-violet-400" /> Recommendation
                                        </h4>
                                        <p className="text-xs text-white/95 leading-relaxed mt-1">
                                            Approve expansion into EU enterprise markets. Finance & Strategy confirm a $12M market size achievable on $400k burn.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div>
                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                <AlertTriangle className="h-3 w-3 text-rose-400" /> Key Risk
                                            </h4>
                                            <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">
                                                Strict localized GDPR requirements. (Estimated compliance time: 8 weeks)
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                <Lightbulb className="h-3 w-3 text-cyan-400" /> Opportunity
                                            </h4>
                                            <p className="text-[11px] text-gray-300 mt-0.5 leading-snug">
                                                Pre-emption of Series B competitors lacks enterprise local presence.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Next Actions & Sparklines Footer */}
                            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                                <div>
                                    <span className="text-[9px] text-gray-500 uppercase tracking-wider block">Synthesized by</span>
                                    <span className="text-xs font-bold text-white flex items-center gap-1">
                                        WaveX Core Engine
                                    </span>
                                </div>
                                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-semibold text-xs transition-colors">
                                    Next Actions <ArrowRight className="h-3 w-3" />
                                </button>
                            </div>

                        </div>

                    </div>

                    {/* Bottom Analytics Sparklines Section */}
                    <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-4">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.01] border border-white/5">
                            <div>
                                <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">Growth Delta</p>
                                <p className="text-sm font-bold text-white">+18.2%</p>
                            </div>
                            <Sparkline points={[12, 15, 14, 18, 22, 21, 26]} color="#a855f7" />
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.01] border border-white/5">
                            <div>
                                <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">LTV Forecast</p>
                                <p className="text-sm font-bold text-white">$14.5K</p>
                            </div>
                            <Sparkline points={[10, 11, 10.5, 12, 13, 13.8, 14.5]} color="#3b82f6" />
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.01] border border-white/5">
                            <div>
                                <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest">CAC Decay</p>
                                <p className="text-sm font-bold text-white">$112</p>
                            </div>
                            <Sparkline points={[180, 160, 145, 135, 128, 118, 112]} color="#06b6d4" />
                        </div>
                    </div>

                </div>
            </motion.div>

            {/* Embedded badge style micro indicators */}
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-6 -right-6 hidden lg:flex items-center gap-2 py-2 px-3.5 rounded-xl glass-panel border border-violet-500/30 shadow-lg shadow-violet-500/5"
            >
                <div className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse" />
                <span className="text-xs font-semibold text-white">Board meeting synth ready</span>
            </motion.div>

            <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -left-10 hidden lg:flex items-center gap-2.5 py-2 px-4 rounded-xl glass-panel border border-blue-500/20 shadow-lg shadow-blue-500/5"
            >
                <span className="text-xs font-semibold text-emerald-400">+3.2m Saved Runway</span>
            </motion.div>
        </div>
    );
}
