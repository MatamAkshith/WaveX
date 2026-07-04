import React from 'react';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Mail, Key, Award, Heart } from 'lucide-react';

export default function FounderProfile() {
    const credentials = [
        { title: 'Full Name', value: 'Juliet Dev' },
        { title: 'Designation Role', value: 'Chief Executive Officer & Founder' },
        { title: 'Registered Email', value: 'founder@decisionos.com' },
        { title: 'Workspace Rank', value: 'Super Administrator' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-8"
        >
            {/* Page Header */}
            <div className="text-left space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-white">Founder Profile</h1>
                <p className="text-sm text-gray-400 font-normal">Manage your profile, credentials, and default decision parameters.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main profile section */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left space-y-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <User className="h-5 w-5 text-violet-400" />
                            Superuser Details
                        </h3>

                        {/* Profile Avatar Card inside */}
                        <div className="flex flex-col sm:flex-row items-center gap-4.5 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center text-3xl font-black tracking-tight text-white shadow-xl shadow-violet-500/10">
                                JD
                            </div>
                            <div className="text-center sm:text-left space-y-1">
                                <span className="px-2 py-0.5 rounded-full font-bold text-[9px] tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    SYSTEM ACTIVE
                                </span>
                                <h4 className="text-base font-bold text-white">Juliet Dev</h4>
                                <p className="text-xs text-gray-400 font-normal">Registered Super Administrator for DecisionOS</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {credentials.map((cred, idx) => (
                                <div key={idx} className="space-y-1.5 flex flex-col">
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{cred.title}</span>
                                    <input
                                        type="text"
                                        value={cred.value}
                                        className="px-4.5 py-3 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-white text-sm"
                                        readOnly
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="space-y-1.5 flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Linked Public Keys (Signature Verification)</span>
                            <div className="relative">
                                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <input
                                    type="text"
                                    value="ed25519_pk1q9z5y8...20p9s3g28d7"
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-gray-400 text-sm font-mono"
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Credentials metrics */}
                <div className="space-y-6">
                    <div className="glass-panel p-5.5 rounded-2xl border border-white/5 shadow-xl text-left space-y-4">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                            <Award className="h-4 w-4 text-violet-400" />
                            Founder Authorities
                        </h4>
                        <div className="space-y-3">
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                <span className="text-xs font-bold text-white">Full Decision Sign-off</span>
                                <p className="text-[11px] text-gray-400 leading-normal">
                                    Authorized to override AI Specialist vetoes and approve high-impact proposals.
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                                <span className="text-xs font-bold text-white">Context Integrations</span>
                                <p className="text-[11px] text-gray-400 leading-normal">
                                    Permissions to hook company repositories, database configurations, and ledger storage.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </motion.div>
    );
}
