import React from 'react';
import { motion } from 'framer-motion';

export default function AuthCard({ children }) {
    return (
        <div className="relative w-full max-w-md mx-auto">
            {/* Abstract background blur orbs */}
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 35, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full glass-panel gradient-border rounded-2xl p-8 shadow-2xl shadow-black/60 relative z-10"
            >
                <div className="absolute inset-0 bg-gradient-to-b from-white/[0.01] to-transparent pointer-events-none rounded-2xl" />
                <div className="relative z-10">
                    {children}
                </div>
            </motion.div>
        </div>
    );
}
