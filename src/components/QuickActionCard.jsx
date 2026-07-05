import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function QuickActionCard({ title, desc, icon: Icon, to }) {
    const Card = () => (
        <div className="p-5 rounded-2xl glass-panel relative overflow-hidden text-left flex flex-col justify-between h-full group hover:border-violet-500/20 transition-all select-none">
            <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-xl bg-violet-600/5 group-hover:bg-violet-600/10 border border-violet-500/15 group-hover:border-violet-500/30 flex items-center justify-center text-violet-400 transition-colors">
                    <Icon className="h-4.5 w-4.5" />
                </div>
                <h4 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">{title}</h4>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed font-normal">{desc}</p>
        </div>
    );

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="h-full"
        >
            {to ? (
                <Link to={to} className="block h-full">
                    <Card />
                </Link>
            ) : (
                <div className="h-full cursor-not-allowed">
                    <Card />
                </div>
            )}
        </motion.div>
    );
}
