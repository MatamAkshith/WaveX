import React from 'react';
import { ShieldCheck, Tag, HelpCircle, Activity } from 'lucide-react';

export default function CompanySnapshot() {
    const specs = [
        { label: 'Startup Stage', value: 'Seed', badge: true },
        { label: 'Industry', value: 'Artificial Intelligence', badge: false },
        { label: 'Runway Span', value: '12 Months', badge: true },
        { label: 'Business Model', value: 'B2B SaaS Enterprise', badge: false },
        { label: 'Country / Base', value: 'United States (Delaware)', badge: false },
        { label: 'MRR Benchmark', value: '$50,000 / Month', badge: true },
    ];

    return (
        <div className="glass-panel p-5.5 rounded-2xl border border-white/5 shadow-xl text-left">
            <div className="flex items-center gap-2 mb-4.5">
                <Activity className="h-4.5 w-4.5 text-violet-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Company Snapshot</h4>
            </div>

            <div className="space-y-4">
                {specs.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs pb-3 border-b border-white/[0.03] last:border-0 last:pb-0">
                        <span className="text-gray-500 font-medium">{item.label}</span>
                        {item.badge ? (
                            <span className="px-2.5 py-0.5 rounded-full font-extrabold text-[10px] tracking-wide uppercase bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                {item.value}
                            </span>
                        ) : (
                            <span className="text-white font-semibold text-right">{item.value}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
