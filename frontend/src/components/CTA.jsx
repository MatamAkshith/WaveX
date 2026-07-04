import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, ArrowRight } from 'lucide-react';

import { Link } from 'react-router-dom';

export default function CTA() {
    return (
        <section id="contact" className="py-24 relative overflow-hidden bg-[#0B0B0B]">

            {/* Decorative gradient blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[160px] pointer-events-none" />

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, cubicBezier: [0.16, 1, 0.3, 1] }}
                    className="relative rounded-3xl overflow-hidden border border-white/10 dark-grid-bg p-8 sm:p-12 md:p-16 text-center shadow-2xl bg-gradient-to-tr from-violet-950/20 via-neutral-950/90 to-blue-950/20"
                >
                    {/* Subtle grid pattern inside */}
                    <div className="absolute inset-0 bg-size-[32px] opacity-10 pointer-events-none mix-blend-overlay"
                        style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)' }} />

                    <div className="relative z-10 flex flex-col items-center">
                        {/* Action Icon */}
                        <div className="h-12 w-12 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center mb-6">
                            <Sparkles className="h-6 w-6 text-violet-400" />
                        </div>

                        {/* Headline */}
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6 max-w-2xl">
                            Ready to Build <br />
                            <span className="gradient-text font-black">Smarter Startups?</span>
                        </h2>

                        {/* Subheadline */}
                        <p className="text-gray-400 text-lg max-w-xl mb-10 leading-relaxed font-normal">
                            Set up your workspaces in under 5 minutes. Securely connect your dashboards, coordinate your AI Specialists, and make executive-level resolutions today.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
                            <Link
                                to="/signup"
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-base shadow-xl shadow-violet-500/10 hover:shadow-violet-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 group"
                            >
                                Get Started Free
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            </Link>

                            <a
                                href="mailto:sales@wavex.ai"
                                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-base border border-white/10 transition-all flex items-center justify-center gap-2"
                            >
                                <Mail className="h-4 w-4 text-gray-300" />
                                Contact Sales
                            </a>
                        </div>

                        {/* Micro details */}
                        <p className="text-xs text-gray-500 mt-6 tracking-wide">
                            No credit card required. SOC2 compliant deployment.
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
