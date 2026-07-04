import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Building, Globe, Mail, MapPin, Milestone, CheckCircle2, AlertCircle } from 'lucide-react';
import CompanySnapshot from '../components/CompanySnapshot';
import { useCompany } from '../hooks/useCompany';

export default function CompanyProfile() {
    const [name, setName] = useState('BoardMind & WaveX Inc.');
    const [industry, setIndustry] = useState('B2B AI Decision Intelligence');
    const [website, setWebsite] = useState('https://wavex.ai');
    const [email, setEmail] = useState('founder@wavex.ai');
    const [location, setLocation] = useState('1209 North Orange St, Wilmington, DE 19801');
    const [size, setSize] = useState('11-50');
    const [description, setDescription] = useState('Integrating multi-agent business simulation tracks to guide strategic milestones, mitigate seed-stage runway burn risks, with real-time feedback loops.');

    const { createCompany, loading, error } = useCompany();
    const [toastMessage, setToastMessage] = useState(null);
    const [isErrorToast, setIsErrorToast] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await createCompany({
                name,
                industry,
                size,
                description
            });
            setIsErrorToast(false);
            setToastMessage(result.message || 'Company profile saved successfully.');
            setTimeout(() => setToastMessage(null), 3000);
        } catch (err) {
            setIsErrorToast(true);
            setToastMessage(err instanceof Error ? err.message : 'Failed to save company profile.');
            setTimeout(() => setToastMessage(null), 4000);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="space-y-8 relative"
        >
            {/* Toast Alert */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        className={`fixed top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-xl backdrop-blur-md font-medium text-sm shadow-xl border ${
                            isErrorToast
                                ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                                : 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                        }`}
                    >
                        {isErrorToast ? <AlertCircle className="h-4.5 w-4.5" /> : <CheckCircle2 className="h-4.5 w-4.5" />}
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Page Header */}
            <div className="text-left space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-white">Company Profile</h1>
                <p className="text-sm text-gray-400 font-normal">Manage your corporate metrics, targets, and company parameters.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main form section */}
                <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
                    <div className="glass-panel p-6 rounded-2xl border border-white/5 text-left space-y-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Building className="h-5 w-5 text-violet-400" />
                            Corporate Identity
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5 flex flex-col">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Company Name</span>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="px-4.5 py-3 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-white text-sm focus:border-violet-500 transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5 flex flex-col">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Industry Classification</span>
                                <input
                                    type="text"
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    className="px-4.5 py-3 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-white text-sm focus:border-violet-500 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5 flex flex-col">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Company Website</span>
                                <div className="relative">
                                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <input
                                        type="url"
                                        value={website}
                                        onChange={(e) => setWebsite(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-white text-sm focus:border-violet-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5 flex flex-col">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Contact Email</span>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-white text-sm focus:border-violet-500 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5 flex flex-col">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Headquarters Location</span>
                                <div className="relative">
                                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-white text-sm focus:border-violet-500 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5 flex flex-col">
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Company Size</span>
                                <select
                                    value={size}
                                    onChange={(e) => setSize(e.target.value)}
                                    className="w-full px-4.5 py-3 rounded-xl bg-neutral-900 border border-white/10 outline-none text-white text-sm focus:border-violet-500 transition-all"
                                >
                                    <option value="1-10">1-10 Employees</option>
                                    <option value="11-50">11-50 Employees</option>
                                    <option value="51-200">51-200 Employees</option>
                                    <option value="201-500">201-500 Employees</option>
                                    <option value="500+">500+ Employees</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-1.5 flex flex-col">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Workspace Description</span>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4.5 py-3 rounded-xl bg-white/[0.02] border border-white/10 outline-none text-white text-sm min-h-[100px] resize-none focus:border-violet-500 transition-all"
                            />
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-violet-600/30 transition-all hover:scale-[1.01] flex items-center gap-2 disabled:opacity-50 disabled:scale-100 cursor-pointer"
                            >
                                {loading ? 'Saving Profile...' : 'Save Profile'}
                            </button>
                        </div>
                    </div>
                </form>

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
