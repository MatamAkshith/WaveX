import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import wavexLogo from '../assets/wavex-logo.jpg';
import {
    ShieldCheck,
    Search,
    Bell,
    Sun,
    Moon,
    ChevronDown,
    User,
    Settings as SettingsIcon,
    LogOut,
    Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TopNavbar({ isCollapsed, onMenuClick }) {
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [isDark, setIsDark] = useState(true); // Prototype state

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-black/40 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between">

            {/* Brand Logo & Mobile Trigger */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white"
                    aria-label="Toggle Navigation Drawer"
                >
                    <Menu className="h-4.5 w-4.5" />
                </button>

                <Link to="/" className="flex items-center group">
                    <img 
                        src={wavexLogo} 
                        alt="WaveX Logo" 
                        className="h-8 w-8 object-cover rounded-lg shadow-md shadow-blue-500/10 group-hover:scale-105 transition-all duration-300" 
                    />
                </Link>
            </div>

            {/* Center Search Input */}
            <div className="hidden sm:flex items-center flex-1 max-w-sm mx-8">
                <div className="relative w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search decisions, parameters, or models..."
                        className="w-full pl-10 pr-4 py-1.5 rounded-full bg-white/[0.02] border border-white/10 outline-none text-white text-xs placeholder:text-gray-500 focus:border-violet-500 focus:bg-white/[0.04] transition-all"
                        readOnly
                    />
                </div>
            </div>

            {/* Right Tools Options */}
            <div className="flex items-center gap-4">

                {/* Notifications Alert Bell */}
                <div className="relative">
                    <button
                        onClick={() => setNotificationsOpen(!notificationsOpen)}
                        className="p-2 rounded-lg bg-white/[0.02] border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all relative"
                    >
                        <Bell className="h-4 w-4" />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-violet-600 rounded-full" />
                    </button>

                    <AnimatePresence>
                        {notificationsOpen && (
                            <>
                                <div onClick={() => setNotificationsOpen(false)} className="fixed inset-0 z-40" />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.12 }}
                                    className="absolute right-0 top-full mt-[28px] w-[350px] max-w-[calc(100vw-2rem)] max-h-[350px] overflow-y-auto glass-panel border border-white/5 bg-[#0B0B0B]/98 rounded-xl p-4 shadow-2xl z-50 text-left"
                                >
                                    <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
                                        <p className="text-xs font-bold text-white uppercase tracking-wider">Recent Notifications</p>
                                        <span className="text-[10px] text-violet-400 font-semibold px-2 py-0.5 rounded-full bg-violet-500/10">3 New</span>
                                    </div>
                                    <div className="space-y-2.5">
                                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-300">
                                            <span className="font-semibold text-white">Finance AI:</span> Runway calculated at 12 months with updated MRR inputs.
                                            <span className="text-[10px] text-gray-500 block mt-1">10 minutes ago</span>
                                        </div>
                                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-300">
                                            <span className="font-semibold text-white">Consensus Formed:</span> Expansion parameter analysis ready.
                                            <span className="text-[10px] text-gray-500 block mt-1">2 hours ago</span>
                                        </div>
                                        <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-gray-300">
                                            <span className="font-semibold text-white">System Status:</span> Ingestion vector engines parsed bylaws documentation details.
                                            <span className="text-[10px] text-gray-500 block mt-1">Yesterday</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* User Workspace Profile dropdown element */}
                <div className="relative">
                    <button
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-full bg-white/[0.02] border border-white/10 hover:bg-white/5 hover:border-white/20 transition-all select-none"
                    >
                        {/* User Avatar */}
                        <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center text-[10px] font-bold text-white">
                            JD
                        </div>
                        <span className="hidden sm:inline text-xs font-semibold text-gray-300">Juliet Dev</span>
                        <ChevronDown className="h-3 w-3 text-gray-500" />
                    </button>

                    <AnimatePresence>
                        {profileOpen && (
                            <>
                                <div onClick={() => setProfileOpen(false)} className="fixed inset-0 z-40" />
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 mt-2 w-48 glass-panel border border-white/5 bg-[#0B0B0B]/95 rounded-2xl py-2 shadow-2xl z-50 text-left"
                                >
                                    <Link
                                        to="/founder"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all text-left w-full"
                                    >
                                        <User className="h-4 w-4 text-violet-400" />
                                        Profile
                                    </Link>

                                    <Link
                                        to="/settings"
                                        onClick={() => setProfileOpen(false)}
                                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-all text-left w-full"
                                    >
                                        <SettingsIcon className="h-4 w-4 text-violet-400" />
                                        Settings
                                    </Link>

                                    <div className="h-px bg-white/5 my-1" />

                                    <button
                                        onClick={() => {
                                            setProfileOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-all text-left font-medium"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Logout
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

            </div>

        </header>
    );
}
