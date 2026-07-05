import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    DollarSign,
    Users,
    Award,
    Brain,
    Upload,
    Sliders,
    History
} from 'lucide-react';
import StatCard from '../components/StatCard';
import { getDashboardSummary, getSession, getHistory } from '../lib/api';
import MetricsPanel from '../components/MetricsPanel';
import QuickActionCard from '../components/QuickActionCard';
import DecisionTable from '../components/DecisionTable';
import CompanySnapshot from '../components/CompanySnapshot';
import ExpertStatusCard from '../components/ExpertStatusCard';

export default function Dashboard() {
    const fallbackStats = [
        { title: 'Projected Runway', value: '12 Months', icon: Calendar, trend: 'Calculated matching current burn rate', trendType: 'neutral' },
        { title: 'Monthly Recurring Revenue', value: '$50K MRR', icon: DollarSign, trend: '+14% growth vs previous month', trendType: 'positive' },
        { title: 'FTE Employees', value: '18', icon: Users, trend: '+2 roles filled last week', trendType: 'positive' },
        { title: 'Funding Phase', value: 'Seed', icon: Award, trend: '$2.5M raised from benchmark VCs', trendType: 'neutral' },
    ];

    const [summary, setSummary] = useState(null);
    const [perf, setPerf] = useState(null);
    const [realDecisions, setRealDecisions] = useState(null);
    useEffect(() => {
        getDashboardSummary().then(setSummary).catch(() => setSummary(null));
        // FOUNDER PERFORMANCE: computed from the real Decision Ledger
        getHistory().then((rows) => {
            if (!rows || rows.length === 0) return;
            const chrono = [...rows].reverse();
            const approved = rows.filter((r) => r.status === 'approved').length;
            const rejected = rows.filter((r) => r.status === 'rejected').length;
            const resolved = approved + rejected;
            const confs = chrono
                .filter((r) => r.final_recommendation)
                .map((r) => Math.round(r.final_recommendation.confidence * 100));
            setPerf({
                metrics: {
                    decisions_made: rows.length,
                    approved,
                    rejected,
                    pending: rows.length - resolved,
                    ...(resolved > 0 && { approval_rate: Math.round((approved / resolved) * 100) }),
                    ...(confs.length > 0 && {
                        avg_confidence: Math.round(confs.reduce((a, b) => a + b, 0) / confs.length),
                    }),
                    ...(confs.length > 1 && { confidence_trend: confs }),
                    ...(chrono.length > 1 && {
                        decision_activity: chrono.map((_, i) => i + 1),
                    }),
                },
                hints: {
                    approval_rate: 'progress_ring', avg_confidence: 'progress_ring',
                    confidence_trend: 'line', decision_activity: 'area',
                    decisions_made: 'bar', approved: 'bar', rejected: 'bar', pending: 'bar',
                },
            });
            setRealDecisions(rows.slice(0, 4).map((r) => ({
                question: r.question,
                status: r.status.charAt(0).toUpperCase() + r.status.slice(1),
                confidence: r.final_recommendation ? `${Math.round(r.final_recommendation.confidence * 100)}%` : '—',
                date: new Date(r.created_at).toLocaleDateString(),
            })));
        }).catch(() => {});
    }, []);

    const hour = new Date().getHours();
    const daypart = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
    const firstName = (summary?.full_name || getSession()?.full_name || 'Founder').split(' ')[0];

    const inr = (n) => (n === null || n === undefined) ? null : `\u20B9${Number(n).toLocaleString('en-IN')}/month`;
    const statItems = summary && summary.company_name ? [
        { title: 'Projected Runway', value: summary.runway_months >= 99 ? 'Profitable' : `${summary.runway_months ?? '—'} Months`, icon: Calendar, trend: 'Auto-calculated from cash / net burn', trendType: 'neutral' },
        { title: 'Monthly Revenue', value: inr(summary.monthly_revenue) || '—', icon: DollarSign, trend: `Stage: ${summary.stage || '—'}`, trendType: 'positive' },
        { title: 'Team Size', value: `${summary.team_size ?? '—'}`, icon: Users, trend: summary.company_name, trendType: 'neutral' },
        { title: 'Current Goal', value: summary.top_goal || 'Set goals', icon: Award, trend: `Funding: ${summary.funding_stage || '—'}`, trendType: 'neutral' },
    ] : fallbackStats;

    const quickActions = [
        { title: 'Ask New Decision', desc: 'Trigger a multi-agent debate simulation on business proposals.', icon: Brain, to: '/decision' },
        { title: 'Upload Documents', desc: 'Add files to build local company context vectors for queries.', icon: Upload, to: '/documents' },
        { title: 'Update Company', desc: 'Modify financial runway targets and corporate configurations.', icon: Sliders, to: '/company' },
        { title: 'View Decision History', desc: 'Browse the historical register of all approved options.', icon: History, to: '/history' },
    ];

    const recentDecisions = [
        { question: 'Should we hire engineers?', status: 'Approved', confidence: '94%', date: 'Today' },
        { question: 'Expand to Singapore?', status: 'Pending', confidence: '82%', date: 'Yesterday' },
        { question: 'Raise Prices?', status: 'Rejected', confidence: '76%', date: 'Last Week' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-8"
        >
            {/* Page Header */}
            <div className="text-left space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-white">Good {daypart}, {firstName} 👋</h1>
                <p className="text-sm text-gray-400 font-normal">
                    Welcome back to the WaveX Decision Room.{summary?.company_name ? ` ${summary.company_name} · ${summary.stage || ''} · Today's AI advisors are ready.` : " Here's an overview of your company."}
                </p>
            </div>

            {/* Grid of 4 StatCards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statItems.map((item, index) => (
                    <StatCard
                        key={index}
                        title={item.title}
                        value={item.value}
                        icon={item.icon}
                        trend={item.trend}
                        trendType={item.trendType}
                    />
                ))}
            </div>

            {/* Grid: Main Section vs Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left main grid column - actions and records */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Quick Actions Panel */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest text-left mb-3.5">Quick Actions</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {quickActions.map((action, index) => (
                                <QuickActionCard
                                    key={index}
                                    title={action.title}
                                    desc={action.desc}
                                    icon={action.icon}
                                    to={action.to}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Founder Performance - real data from the Decision Ledger */}
                    {perf && (
                        <div className="glass-panel p-5.5 rounded-2xl border border-white/5 shadow-xl text-left space-y-1">
                            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Founder Performance</h4>
                            <p className="text-[11px] text-gray-500 font-normal">
                                Computed live from your Decision Ledger — approval rate, confidence trend, and decision activity over time.
                            </p>
                            <MetricsPanel metrics={perf.metrics} hints={perf.hints} />
                        </div>
                    )}

                    {/* Decision Logs */}
                    <DecisionTable data={realDecisions || recentDecisions} />

                </div>

                {/* Right sidebar column - snapshot and experts */}
                <div className="space-y-6">
                    <CompanySnapshot />
                    <ExpertStatusCard />
                </div>

            </div>

        </motion.div>
    );
}
