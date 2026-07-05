import React from 'react';
import { motion } from 'framer-motion';
import { Box, Layers, Play, Radio, ToggleLeft, Disc } from 'lucide-react';

export default function TrustedBy() {
    const startups = [
        { name: 'Aethera', icon: Box, color: 'text-purple-400 group-hover:text-purple-400' },
        { name: 'Kortex', icon: Layers, color: 'text-indigo-400 group-hover:text-indigo-400' },
        { name: 'Nova Flow', icon: Radio, color: 'text-cyan-400 group-hover:text-cyan-400' },
        { name: 'Vortex', icon: ToggleLeft, color: 'text-blue-400 group-hover:text-blue-400' },
        { name: 'Synthetix', icon: Disc, color: 'text-pink-400 group-hover:text-pink-400' },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
    };

    return (
        <section className="py-20 border-y border-white/5 bg-gradient-to-b from-transparent via-white/[0.01] to-transparent relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.5 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-xs font-bold uppercase tracking-widest text-white mb-10"
                >
                    Trusted by ambitious startups & venture-backed teams
                </motion.p>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-100px' }}
                    className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center max-w-4xl mx-auto"
                >
                    {startups.map((startup) => {
                        const Icon = startup.icon;
                        return (
                            <motion.div
                                key={startup.name}
                                variants={itemVariants}
                                className="group flex flex-col md:flex-row items-center justify-center gap-2.5 cursor-pointer"
                            >
                                <div className="flex items-center gap-2">
                                    <Icon className={`h-6 w-6 text-gray-500 filter grayscale group-hover:grayscale-0 transition-all duration-300 ${startup.color}`} />
                                    <span className="text-lg font-bold tracking-tight text-gray-500 group-hover:text-white transition-all duration-300">
                                        {startup.name}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
