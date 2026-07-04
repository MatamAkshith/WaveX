import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertCircle, Loader2 } from 'lucide-react';
import DecisionTable from '../components/DecisionTable';
import { useDecision } from '../hooks/useDecision';

export default function DecisionHistory() {
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    const { fetchHistory, history, loading, error } = useDecision();

    useEffect(() => {
        fetchHistory().catch(console.error);
    }, []);

    // Map FastAPI schema fields to existing history card format
    const fullLogs = history.map((item) => {
        // Map backend completed status and confidence to our display statuses
        let status = 'Pending';
        if (item.status === 'completed') {
            status = item.confidence >= 0.8 ? 'Approved' : 'Rejected';
        }

        return {
            question: item.recommendation || 'Strategic Business Decision Run',
            status,
            confidence: `${(item.confidence * 100).toFixed(0)}%`,
            date: 'Recently'
        };
    });

    const filteredLogs = fullLogs.filter((item) => {
        const matchesSearch = item.question.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = filter === 'all' || item.status.toLowerCase() === filter;
        return matchesSearch && matchesStatus;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-8"
        >
            {/* Page Header */}
            <div className="text-left space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-white">Decision Ledger</h1>
                <p className="text-sm text-gray-400 font-normal">Review, filter, and audit chronological business outcomes and agent consensus logs.</p>
            </div>

            {/* Control Actions bar */}
            <div className="flex flex-col sm:flex-row items-center gap-4">

                {/* Search */}
                <div className="relative w-full sm:flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search proposal history ledger..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-white text-xs placeholder:text-gray-500 focus:border-violet-500 transition-all text-left"
                    />
                </div>

                {/* Status Filters */}
                <div className="flex items-center gap-2.5 self-start sm:self-auto">
                    {['all', 'approved', 'pending', 'rejected'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize tracking-wide transition-all border ${filter === type
                                    ? 'bg-white/5 border-white/20 text-white shadow-md'
                                    : 'bg-white/[0.02] border-white/5 text-gray-400 hover:text-white'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

            </div>

            {/* Main Table render */}
            <div className="space-y-4">
                {loading ? (
                    <div className="glass-panel p-12 text-center text-sm text-gray-400 rounded-2xl border border-white/5 flex flex-col items-center gap-2 justify-center">
                        <Loader2 className="h-6 w-6 animate-spin text-violet-400" />
                        Fetching decision ledger from backend...
                    </div>
                ) : error ? (
                    <div className="glass-panel p-12 text-center text-sm text-rose-400 rounded-2xl border border-rose-500/10 flex items-center gap-2 justify-center">
                        <AlertCircle className="h-5 w-5" />
                        Error loading ledger: {error}
                    </div>
                ) : filteredLogs.length === 0 ? (
                    <div className="glass-panel p-12 text-center text-sm text-gray-500 rounded-2xl border border-white/5">
                        No decision parameters match search criteria in ledger registry resources.
                    </div>
                ) : (
                    <DecisionTable data={filteredLogs} />
                )}
            </div>

        </motion.div>
    );
}
