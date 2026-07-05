import React from 'react';
import { motion } from 'framer-motion';
import { Building, Globe, Mail, MapPin, Milestone, Sparkles } from 'lucide-react';
import CompanySnapshot from '../components/CompanySnapshot';

export default function CompanyProfile() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-8"
        >
            {/* Page Header */}
            <div className="text-left space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-white">Company Profile</h1>
                <p className="text-sm text-gray-400 font-normal">Manage your corporate metrics, targets, and company parameters.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main form section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left space-y-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Building className="h-5 w-5 text-violet-400" />
                            Corporate Identity
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5ClassName flex flex-col">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Company Name</span>
                                <input
                                    type="text"
                                    value="WaveX Inc."
                                    className="px-4.5 py-3 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-white text-sm"
                                    readOnly
                                />
                            </div>
                            <div className="space-y-1.5 flex flex-col">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Industry Classification</span>
                                <input
                                    type="text"
                                    value="B2B AI Decision Intelligence"
                                    className="px-4.5 py-3 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-white text-sm"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5 flex flex-col">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Company Website</span>
                                <div className="relative">
                                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <input
                                        type="text"
                                        value="https://decisionos.com"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-white text-sm"
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5 flex flex-col">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contact Email</span>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <input
                                        type="text"
                                        value="founder@decisionos.com"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-white text-sm"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1.5 flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Headquarters Location</span>
                            <div className="relative">
                                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <input
                                    type="text"
                                    value="1209 North Orange St, Wilmington, DE 19801"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-white text-sm"
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5 flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Workspace Description</span>
                            <textarea
                                value="Integrating multi-agent business simulation tracks to guide strategic milestones, mitigate seed-stage runway burn risks, with real-time feedback loops."
                                className="px-4.5 py-3 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-white text-sm min-h-[100px] resize-none"
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                {/* Info panel sidebar */}
                <div className="space-y-6">
                    <CompanySnapshot />

                    <div className="glass-panel p-5.5 rounded-2xl border border-white/5 shadow-xl text-left space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Milestone className="h-4 w-4 text-violet-400" />
                            Strategic Roadmap
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed font-normal">
                            These profile items directly impact calculations for Runway forecasts and business growth simulations performed by the Active AI Experts.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
