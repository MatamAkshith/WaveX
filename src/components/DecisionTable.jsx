import React from 'react';
import { CheckCircle2, HelpCircle, XCircle } from 'lucide-react';

export default function DecisionTable({ data }) {
    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle2 className="h-3 w-3" />
                        Approved
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <XCircle className="h-3 w-3" />
                        Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <HelpCircle className="h-3 w-3" />
                        Pending
                    </span>
                );
        }
    };

    return (
        <div className="glass-panel rounded-2xl overflow-hidden text-left border border-white/5 shadow-xl">
            <div className="px-6 py-4.5 border-b border-white/5 flex items-center justify-between">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Recent Decisions Log</h4>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/5 text-gray-500 text-xs font-bold uppercase tracking-wider bg-white/[0.01]">
                            <th className="px-6 py-3.5 text-left">Proposed Question</th>
                            <th className="px-6 py-3.5 text-left">Resolution Status</th>
                            <th className="px-6 py-3.5 text-left">Consensus Confidence</th>
                            <th className="px-6 py-3.5 text-left">Submission Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-gray-300">
                        {data.map((row, idx) => (
                            <tr key={idx} className="hover:bg-white/[0.01] transition-all">
                                <td className="px-6 py-4 font-medium text-white">{row.question}</td>
                                <td className="px-6 py-4">{getStatusBadge(row.status)}</td>
                                <td className="px-6 py-4 font-semibold text-violet-300">{row.confidence}</td>
                                <td className="px-6 py-4 text-xs text-gray-500">{row.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
