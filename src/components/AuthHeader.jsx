import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AuthHeader({ title, subtitle }) {
    return (
        <div className="flex flex-col items-center text-center mb-8">
            {/* Branding and Logo Link */}
            <Link to="/" className="flex items-center gap-2 group mb-6 hover:opacity-90 transition-opacity">
                <img src="/wavex-logo.png" alt="WaveX" className="h-9 w-9 rounded-xl object-cover border border-white/10" />
                <span className="text-xl font-bold tracking-tight text-white">
                    Wave<span className="text-violet-400">X</span>
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
