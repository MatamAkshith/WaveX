import React from 'react';
import { motion } from 'framer-motion';
import {
    UserPlus,
    UploadCloud,
    HelpCircle,
    Bot,
    Award,
    Archive
} from 'lucide-react';

export default function HowItWorks() {
    const steps = [
        {
            num: '01',
            title: 'Create Company Profile',
            desc: 'Connect workspace tools and establish base metrics.',
            icon: UserPlus,
            color: 'from-blue-500 to-indigo-500'
        },
        {
            num: '02',
            title: 'Upload Documents',
            desc: 'Securely sync files, pitches, spreadsheets, or briefs.',
            icon: UploadCloud,
            color: 'from-violet-500 to-purple-500'
        },
        {
            num: '03',
            title: 'Ask Strategic Question',
            desc: 'Draft any query, from pricing changes to GTM hiring.',
            icon: HelpCircle,
            color: 'from-fuchsia-500 to-pink-500'
        },
        {
            num: '04',
            title: 'AI Experts Analyze',
            desc: 'Agents debate trade-offs under strict constraint parameters.',
            icon: Bot,
            color: 'from-rose-500 to-orange-500'
        },
        {
            num: '05',
            title: 'Receive Executive Advice',
            desc: 'Obtain reports with risks, opportunities, and action items.',
            icon: Award,
            color: 'from-emerald-500 to-teal-500'
        },
        {
            num: '06',
            title: 'Memory Storage',
            desc: 'Approved routes integrate into context for future steps.',
            icon: Archive,
            color: 'from-cyan-500 to-blue-500'
        }
    ];

    return (
        <section id="how-it-works" className="py-32 relative bg-[#0B0B0B] overflow-hidden">
            {/* Visual accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Section Header */}
                <div className="text-center max-w-3xl mx-auto mb-24">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                        <span className="text-xs font-semibold text-violet-400">Workflow</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
                        From Context to Execution.
                    </h2>
                    <p className="text-gray-400 text-lg">
                        How DecisionOS transforms enterprise raw materials into boardroom-ready recommendations.
                    </p>
                </div>

                {/* Timeline Desktop & Tablet (Horizontal/Grid style) */}
                <div className="hidden lg:block relative">

                    {/* Glowing connecting horizontal line */}
                    <div className="absolute top-[68px] left-[7%] right-[7%] h-[2px] bg-gradient-to-r from-blue-500via-violet-500 via-pink-500 to-emerald-500 opacity-20" />

                    <div className="grid grid-cols-6 gap-6 relative">
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: '-40px' }}
                                    transition={{ duration: 0.6, delay: idx * 0.1, ease: 'easeOut' }}
                                    className="flex flex-col items-center text-center group"
                                >
                                    {/* Step bubble */}
                                    <div className="relative mb-6 z-10">
                                        <div className="w-16 h-16 rounded-2xl bg-[#121212] border border-white/10 flex items-center justify-center relative group-hover:border-violet-500/50 group-hover:shadow-lg group-hover:shadow-violet-500/10 transition-all duration-300">

                                            {/* Gradient aura behind icon on hover */}
                                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-tr ${step.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

                                            <Icon className="h-6 w-6 text-gray-400 group-hover:text-white transition-colors" />

                                            {/* Step Number Badge */}
                                            <span className="absolute -top-2 -right-2 text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400 font-bold group-hover:text-violet-400 group-hover:border-violet-500/20 transition-colors">
                                                {step.num}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-violet-200 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-400 text-xs leading-relaxed max-w-[160px] mx-auto">
                                        {step.desc}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>

                </div>

                {/* Timeline Mobile & Small Tablet (Vertical structure) */}
                <div className="lg:hidden relative pl-8 border-l border-white/10 space-y-12">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: '-20px' }}
                                transition={{ duration: 0.6, delay: 0.05 }}
                                className="relative flex items-start gap-4 group"
                            >
                                {/* Visual marker dot overlapping vertical line */}
                                <div className="absolute -left-[49px] top-1.5 w-8 h-8 rounded-lg bg-[#121212] border border-white/10 flex items-center justify-center z-10 group-hover:border-violet-500/50 transition-colors">
                                    <Icon className="h-4 w-4 text-gray-400 group-hover:text-white" />
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-violet-400">{step.num}</span>
                                        <h3 className="text-lg font-bold text-white group-hover:text-violet-200 transition-colors">
                                            {step.title}
                                        </h3>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                                        {step.desc}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}
