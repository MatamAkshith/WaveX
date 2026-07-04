import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="pt-20 pb-12 border-t border-white/5 bg-[#070707] relative overflow-hidden">

            {/* Visual top border blend */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">

                    {/* Logo & Pitch */}
                    <div className="lg:col-span-2 flex flex-col items-start gap-4">
                        <a href="#" className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center">
                                <ShieldCheck className="h-4.5 w-4.5 text-white" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">
                                Decision<span className="text-violet-400">OS</span>
                            </span>
                        </a>

                        <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
                            The AI-powered Decision Operating System that equips startup founders with structured advice, specialist debate models, and perpetual organizational memory.
                        </p>

                        {/* Social handles */}
                        <div className="flex items-center gap-4 mt-2">
                            <a
                                href="#"
                                className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                                aria-label="GitHub"
                            >
                                <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                                aria-label="LinkedIn"
                            >
                                <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                                </svg>
                            </a>
                            <a
                                href="#"
                                className="h-9 w-9 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-all"
                                aria-label="Twitter"
                            >
                                <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    {/* Column 1: Product */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li>
                                <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                                    Pricing
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-bold">Beta</span>
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Roadmap</a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Company */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li>
                                <a href="#why-decision-os" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1.5">
                                    Careers
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">We're hiring</span>
                                </a>
                            </li>
                            <li>
                                <a href="#contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-6">Resources</h4>
                        <ul className="space-y-4">
                            <li>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Documentation</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                            </li>
                            <li>
                                <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</a>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Final footer divider & Copyright */}
                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-gray-500">
                        &copy; {currentYear} DecisionOS Technologies Inc. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-gray-500">
                        <a href="#" className="hover:text-white transition-colors">Security Overview</a>
                        <a href="#" className="hover:text-white transition-colors">System Status</a>
                    </div>
                </div>

            </div>
        </footer>
    );
}
