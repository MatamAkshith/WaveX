import React from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    BookOpen,
    Users,
    BrainCircuit,
    Database,
    CheckSquare
} from 'lucide-react';

export default function Features() {
    const featureList = [
        {
            icon: Building2,
            title: 'Business Context',
            description: "Automatically index your company's metrics, cap tables, user cohort reports, and historical board decks to construct a true-to-life context engine.",
            color: 'from-blue-600 to-cyan-500',
            glow: 'shadow-blue-500/10'
        },
        {
            icon: BookOpen,
            title: 'Startup Knowledge',
            description: "Powered by a fine-tuned RAG knowledge base incorporating decades of startup best practices, legal playbooks, and venture partner frameworks.",
            color: 'from-violet-600 to-purple-500',
            glow: 'shadow-violet-500/10'
        },
        {
            icon: Users,
            title: 'AI Experts Collaboration',
            description: "Before delivery, dedicated AI agents representing Finance, Legal, HR, Product, and Go-To-Market debate trade-offs to reach a consensus report.",
            color: 'from-pink-600 to-rose-500',
            glow: 'shadow-pink-500/10'
        },
        {
            icon: BrainCircuit,
            title: 'Decision Intelligence',
            description: "Leverages an advanced planner-judge-executor architecture to stress-test ideas, evaluate risks, outline critical blockers, and draft action steps.",
            color: 'from-amber-600 to-yellow-500',
            glow: 'shadow-amber-500/10'
        },
        {
            icon: Database,
            title: 'Organizational Memory',
            description: "Your past strategic resolutions, outcomes, and contextual updates are indexed indefinitely. Keep your executive agents aligned as the market changes.",
            color: 'from-emerald-600 to-teal-500',
            glow: 'shadow-emerald-500/10'
        },
        {
            icon: CheckSquare,
            title: 'Confidence Transparency',
            description: "No black boxes. Every executive advice sheet is scored with clear confidence percentages, explicit parameter weights, and direct source citations.",
            color: 'from-indigo-600 to-blue-500',
            glow: 'shadow-indigo-500/10'
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <section id="features" className="py-32 relative bg-[#0B0B0B]">

            {/* Decorative Glows */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-violet-900/10 via-blue-900/10 to-indigo-900/10 rounded-full blur-[160px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4"
                    >
                        <span className="text-xs font-semibold text-violet-400">Core Features</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6"
                    >
                        An Autonomous Operating <br />System for Executive Clarity.
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-gray-400 text-lg"
                    >
                        Move beyond simple generative text wrappers. Experience structured organizational intelligence powered by collaborative AI reasoning.
                    </motion.p>
                </div>

                {/* Feature Cards Grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {featureList.map((feature, idx) => {
                        const Icon = feature.icon;

                        return (
                            <motion.div
                                key={idx}
                                variants={cardVariants}
                                className={`glass-panel glass-panel-hover rounded-2xl p-8 flex flex-col justify-between h-full relative overflow-hidden group shadow-lg ${feature.glow}`}
                            >
                                {/* Glow layer (absolute) */}
                                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div>
                                    {/* Icon Wrapper */}
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${feature.color} p-2.5 flex items-center justify-center mb-6 shadow-md shadow-black/20 group-hover:scale-105 transition-transform`}>
                                        <Icon className="h-6 w-6 text-white" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-violet-200 transition-colors">
                                        {feature.title}
                                    </h3>

                                    {/* Description */}
                                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Inline link decorative indicator */}
                                <span className="text-xs font-semibold text-violet-400/80 group-hover:text-violet-300 flex items-center gap-1 mt-4 transition-colors">
                                    Learn more
                                    <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                                </span>

                            </motion.div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
}
