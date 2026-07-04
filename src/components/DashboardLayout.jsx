import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';

export default function DashboardLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col font-sans relative">

            {/* Top Navbar */}
            <TopNavbar
                isCollapsed={isCollapsed}
                onMenuClick={() => setIsMobileOpen(!isMobileOpen)}
            />

            <div className="flex flex-1 pt-16 relative">
                {/* Collapsible Sidebar */}
                <Sidebar
                    isCollapsed={isCollapsed}
                    setIsCollapsed={setIsCollapsed}
                    isMobileOpen={isMobileOpen}
                    setIsMobileOpen={setIsMobileOpen}
                />

                {/* Floating Backdrop for mobile layout */}
                {isMobileOpen && (
                    <div
                        onClick={() => setIsMobileOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
                    />
                )}

                {/* Scrollable Main Area */}
                <main
                    className={`flex-1 transition-all duration-300 min-h-[calc(100vh-4rem)] p-6 md:p-8 ${isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
                        }`}
                >
                    <div className="max-w-7xl mx-auto space-y-8">
                        <Outlet />
                    </div>
                </main>
            </div>

        </div>
    );
}
