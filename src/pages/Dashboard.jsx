import React from 'react';
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
import QuickActionCard from '../components/QuickActionCard';
import DecisionTable from '../components/DecisionTable';
import CompanySnapshot from '../components/CompanySnapshot';
import ExpertStatusCard from '../components/ExpertStatusCard';

export default function Dashboard() {
    const statItems = [
        { title: 'Projected Runway', value: '12 Months', icon: Calendar, trend: 'Calculated matching current burn rate', trendType: 'neutral' },
        { title: 'Monthly Recurring Revenue', value: '$50K MRR', icon: DollarSign, trend: '+14% growth vs previous month', trendType: 'positive' },
        { title: 'FTE Employees', value: '18', icon: Users, trend: '+2 roles filled last week', trendType: 'positive' },
        { title: 'Funding Phase', value: 'Seed', icon: Award, trend: '$2.5M raised from benchmark VCs', trendType: 'neutral' },
    ];

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
                <h1 className="text-3xl font-black tracking-tight text-white">Dashboard</h1>
                <p className="text-sm text-gray-400 font-normal">Welcome back! Here's an overview of your company.</p>
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

                    {/* Decision Logs */}
                    <DecisionTable data={recentDecisions} />

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
