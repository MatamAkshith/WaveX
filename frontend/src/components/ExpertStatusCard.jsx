import React from 'react';
import { Bot, Radio } from 'lucide-react';

export default function ExpertStatusCard() {
    const experts = [
        { name: 'Finance AI', desc: 'Runway analysis and burn simulations.' },
        { name: 'Hiring AI', desc: 'Org development and headcounts budgeting.' },
        { name: 'Legal AI', desc: 'Compliance checks and regulatory reviews.' },
        { name: 'GTM AI', desc: 'CAC management and sales optimization.' },
        { name: 'Product AI', desc: 'Feature sizing and release valuation.' },
    ];

    return (
        <div className="glass-panel p-5.5 rounded-2xl border border-white/5 shadow-xl text-left bg-gradient-to-tr from-neutral-950/80 to-violet-950/[0.04]">
            <div className="flex items-center gap-2 mb-4.5">
                <Bot className="h-4.5 w-4.5 text-violet-400" />
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Active AI Board Experts</h4>
            </div>

            <div className="space-y-4">
                {experts.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        <div className="relative mt-0.5 flex-shrink-0">
                            <div className="h-7 w-7 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-violet-400">
                                <Bot className="h-4 w-4" />
                            </div>
                            <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-black" />
                        </div>

                        <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-white tracking-wide">{item.name}</span>
                                <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.2 rounded font-medium">READY</span>
                            </div>
                            <p className="text-[11px] text-gray-400 leading-relaxed font-normal">{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
