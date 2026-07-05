import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Building,
    User,
    FileText,
    Brain,
    History,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar({ isCollapsed, setIsCollapsed, isMobileOpen, setIsMobileOpen }) {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };

    const navItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { name: 'Company Profile', path: '/company', icon: Building },
        { name: 'Founder Profile', path: '/founder', icon: User },
        { name: 'Documents', path: '/documents', icon: FileText },
        { name: 'Ask Decision', path: '/decision', icon: Brain },
        { name: 'Decision History', path: '/history', icon: History },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    const sidebarVariants = {
        expanded: { width: '256px' },
        collapsed: { width: '80px' },
    };

    return (
        <>
            <aside
                className={`fixed top-16 bottom-0 left-0 z-40 bg-[#0B0B0B]/95 backdrop-blur-md border-r border-white/5 flex flex-col justify-between py-6 transition-all duration-300 lg:translate-x-0 ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64 lg:w-auto lg:translate-x-0'
                    } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'
                    }`}
            >
                <div className="px-4 space-y-8 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;

                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsMobileOpen(false)}
                                    className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-left text-sm font-semibold transition-all relative group overflow-hidden ${isActive
                                        ? 'bg-white/5 text-white border border-white/10'
                                        : 'text-gray-400 hover:text-white hover:bg-white/[0.01]'
                                        }`}
                                >
                                    <Icon className={`h-4.5 w-4.5 flex-shrink-0 transition-transform group-hover:scale-105 duration-200 ${isActive ? 'text-violet-400' : 'text-gray-400'
                                        }`} />

                                    {(!isCollapsed || isMobileOpen) && (
                                        <span className="whitespace-nowrap transition-opacity duration-200">
                                            {item.name}
                                        </span>
                                    )}

                                    {/* Icon Only Tooltip on collapse mode */}
                                    {isCollapsed && !isMobileOpen && (
                                        <div className="absolute left-16 top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 rounded-lg bg-black border border-white/10 text-[10px] font-bold text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-xl whitespace-nowrap z-50">
                                            {item.name}
                                        </div>
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="space-y-1 pt-4 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-left text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-all group relative overflow-hidden"
                        >
                            <LogOut className="h-4.5 w-4.5 flex-shrink-0" />
                            {(!isCollapsed || isMobileOpen) && <span>Logout</span>}

                            {isCollapsed && !isMobileOpen && (
                                <div className="absolute left-16 top-1/2 -translate-y-1/2 ml-2 px-2.5 py-1.5 rounded-lg bg-black border border-rose-500/20 text-[10px] font-bold text-rose-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 shadow-xl whitespace-nowrap z-50">
                                    Logout
                                </div>
                            )}
                        </button>

                        {/* Collapse/Expand Sidebar Actions Toggle - Desktop Only */}
                        <div className="hidden lg:flex justify-end pt-4">
                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className="p-2 rounded-lg bg-white/[0.02] border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                                aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                            >
                                {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
