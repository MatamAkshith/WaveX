import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthHeader({ title, subtitle }) {
    return (
        <div className="flex flex-col items-center text-center mb-8">
            {/* Branding and Logo Link */}
            <Link to="/" className="flex items-center gap-2 group mb-6 hover:opacity-90 transition-opacity">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">
                    Decision<span className="text-violet-400">OS</span>
                </span>
            </Link>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
                {title}
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                {subtitle}
            </p>
        </div>
    );
}
