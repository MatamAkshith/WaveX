import React from 'react';
import { motion } from 'framer-motion';
import { Network, Database, Sparkles } from 'lucide-react';

export default function WhyDecisionOS() {
    const cards = [
        {
            badge: 'Context First',
            title: 'Not Just ChatGPT',
            description: "Generic AI chatbots lack local alignment. DecisionOS models your cap table, burn models, active board decks, and strategy specs to answer queries in complete context.",
            icon: Network,
            color: 'from-violet-500/10 to-transparent',
            borderColor: 'border-violet-500/20',
            textColor: 'text-violet-400',
            illustration: (
                <svg viewBox="0 0 200 120" className="w-full h-28 opacity-60">
                    <defs>
                        <linearGradient id="linesGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>
                    {/* Main Nodes */}
                    <circle cx="30" cy="60" r="6" fill="#8b5cf6" />
                    <circle cx="80" cy="30" r="5" fill="#3b82f6" />
                    <circle cx="80" cy="90" r="5" fill="#3b82f6" />
                    <circle cx="140" cy="20" r="4" fill="#a855f7" />
                    <circle cx="140" cy="60" r="4" fill="#3b82f6" />
                    <circle cx="140" cy="100" r="4" fill="#06b6d4" />
                    {/* Linking paths */}
                    <path d="M30 60 L80 30 M30 60 L80 90 M80 30 L140 20 M80 30 L140 60 M80 90 L140 60 M80 90 L140 100" stroke="url(#linesGrad)" strokeWidth="1.5" strokeDasharray="3 3" fill="none" />
                    {/* Central Pulsing Target */}
                    <circle cx="30" cy="60" r="12" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.4" fill="none" className="animate-ping" style={{ transformOrigin: '30px 60px' }} />
                </svg>
            )
        },
        {
            badge: 'Collaborative Board',
            title: 'Executive-Level Decisions',
            description: "Multiple discrete AI modules representing finance, human capital, marketing, and legal trade-offs analyze your proposal before creating recommendations.",
            icon: Sparkles,
            color: 'from-blue-500/10 to-transparent',
            borderColor: 'border-blue-500/20',
            textColor: 'text-blue-400',
            illustration: (
                <svg viewBox="0 0 200 120" className="w-full h-28 opacity-60">
                    <defs>
                        <linearGradient id="orbGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                    </defs>
                    {/* Circular Rings */}
                    <circle cx="100" cy="60" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="1" fill="none" />
                    <circle cx="100" cy="60" r="28" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
                    {/* Overlapping spheres */}
                    <circle cx="85" cy="50" r="22" fill="url(#orbGrad)" fillOpacity="0.15" />
                    <circle cx="115" cy="70" r="22" fill="url(#orbGrad)" fillOpacity="0.15" />

                    <line x1="85" y1="50" x2="115" y2="70" stroke="#fff" strokeOpacity="0.2" strokeWidth="1" />
                    <circle cx="100" cy="60" r="3" fill="#ffffff" />
                </svg>
            )
        },
        {
            badge: 'Searchable Platform',
            title: 'Continuous RAG Learning',
            description: "Every resolved path compiles as static company knowledge. New query prompts pull historical decisions to improve context relevance and track founder progress.",
            icon: Database,
            color: 'from-emerald-500/10 to-transparent',
            borderColor: 'border-emerald-500/20',
            textColor: 'text-emerald-400',
            illustration: (
                <svg viewBox="0 0 200 120" className="w-full h-28 opacity-60">
                    {/* Stacked Ledger Blocks */}
                    <g transform="translate(40, 20)">
                        <rect x="10" y="30" width="100" height="20" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                        <rect x="10" y="55" width="100" height="20" rx="4" fill="rgba(139,92,246,0.05)" stroke="rgba(139,92,246,0.2)" strokeWidth="1" />
                        <rect x="10" y="80" width="100" height="20" rx="4" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                        {/* Lines inside boxes */}
                        <line x1="20" y1="40" x2="60" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
                        <line x1="20" y1="65" x2="80" y2="65" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.8" />
                        <line x1="20" y1="90" x2="50" y2="90" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeLinecap="round" />
                    </g>
                </svg>
            )
        }
    ];

    return (
        <section id="why-decision-os" className="py-32 relative bg-[#0B0B0B]">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Section Title */}
                <div className="max-w-3xl mb-20">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                        <span className="text-xs font-semibold text-violet-400">Design Philosophy</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                        Engineered Differently than <br />Standard Conversational Chat.
                    </h2>
                    <p className="text-gray-400 text-lg">
                        Unlike simple utility wrappers, DecisionOS is designed as a structured ecosystem focused on deep reasoning and organizational long-term consistency.
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {cards.map((card, idx) => {
                        const Icon = card.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                                className={`flex flex-col justify-between p-8 rounded-2xl bg-gradient-to-b ${card.color} border ${card.borderColor} relative group overflow-hidden`}
                            >
                                <div>
                                    <div className="flex items-center justify-between mb-8">
                                        <span className={`text-[10px] uppercase font-bold tracking-wider ${card.textColor} px-2.5 py-1 rounded-full bg-white/5`}>
                                            {card.badge}
                                        </span>
                                        <Icon className={`h-5 w-5 ${card.textColor}`} />
                                    </div>

                                    <h3 className="text-xl font-bold text-white mb-4">
                                        {card.title}
                                    </h3>

                                    <p className="text-gray-400 text-sm leading-relaxed mb-8">
                                        {card.description}
                                    </p>
                                </div>

                                {/* Abstract graphic */}
                                <div className="mt-auto pt-4 flex items-center justify-center border-t border-white/[0.04] bg-neutral-900/10 rounded-xl py-2 px-1">
                                    {card.illustration}
                                </div>

                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
