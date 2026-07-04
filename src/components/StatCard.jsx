import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon: Icon, trend, trendType = 'neutral' }) {
    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="p-5 rounded-2xl glass-panel relative overflow-hidden text-left"
        >
            <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{title}</span>
                <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-violet-400">
                    <Icon className="h-4.5 w-4.5" />
                </div>
            </div>

            <h3 className="text-3xl font-black tracking-tight text-white mb-2">{value}</h3>

            {trend && (
                <span className={`text-[10px] font-semibold tracking-wide ${trendType === 'positive'
                        ? 'text-emerald-400'
                        : trendType === 'negative'
                            ? 'text-rose-400'
                            : 'text-gray-400'
                    }`}>
                    {trend}
                </span>
            )}
        </motion.div>
    );
}
