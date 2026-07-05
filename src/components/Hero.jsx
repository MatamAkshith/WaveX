import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Cpu, ShieldCheck, Zap } from 'lucide-react';
import DashboardMockup from './DashboardMockup';

export default function Hero() {
    return (
        <section className="relative min-h-screen pt-32 pb-24 overflow-hidden grid-bg flex items-center">
            {/* Background gradients */}
            <div className="absolute top-0 inset-x-0 h-screen bg-gradient-to-b from-[#0B0B0B] via-[#0B0B0B]/90 to-[#0B0B0B] pointer-events-none z-0" />

            {/* Grid mask to fade the edges */}
            <div className="absolute inset-0 radial-mask pointer-events-none z-0 pointer-events-none opacity-60" />

            {/* Decorative floating blur spheres */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none z-0" />

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

                    {/* Left Column (Hero Content) */}
                    <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">

                        {/* Version / Launch Pills */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md"
                        >
                            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                            <span className="text-xs font-semibold text-violet-300">WaveX v1.0 - Now Public</span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.08] mb-6 block"
                        >
                            Make Startup Decisions Like an <br className="hidden sm:inline" />
                            <span className="gradient-text font-black">Executive Board.</span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-gray-400 text-lg md:text-xl font-normal leading-relaxed max-w-xl mb-8"
                        >
                            WaveX combines company context, AI specialists, startup knowledge, and organizational memory to help founders make confident, executive-level business decisions.
                        </motion.p>

                        {/* Action buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12"
                        >
                            <Link
                                to="/signup"
                                className="w-full sm:w-auto text-center px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white font-semibold text-base shadow-xl shadow-violet-500/20 hover:shadow-violet-500/35 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 group"
                            >
                                Get Started Free
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <a
                                href="#how-it-works"
                                className="w-full sm:w-auto text-center px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-base border border-white/10 transition-all flex items-center justify-center gap-2 group"
                            >
                                <Play className="h-4 w-4 fill-white text-white group-hover:scale-110 transition-transform" />
                                Watch Demo
                            </a>
                        </motion.div>

                        {/* Trust Badges */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="w-full"
                        >
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">
                                platform grade security
                            </p>
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className="p-1 rounded bg-white/5 border border-white/10">
                                        <Cpu className="h-4 w-4 text-violet-400" />
                                    </div>
                                    <span className="text-sm font-medium tracking-wide">AI Powered Synth</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="p-1 rounded bg-white/5 border border-white/10">
                                        <ShieldCheck className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <span className="text-sm font-medium tracking-wide">Enterprise Ready</span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="p-1 rounded bg-white/5 border border-white/10">
                                        <Zap className="h-4 w-4 text-emerald-400" />
                                    </div>
                                    <span className="text-sm font-medium tracking-wide">Secure by Design</span>
                                </div>
                            </div>
                        </motion.div>

                    </div>

                    {/* Right Column (Dashboard Mockup) */}
                    <div className="lg:col-span-6 w-full flex items-center justify-center">
                        <DashboardMockup />
                    </div>

                </div>
            </div>
        </section>
    );
}
