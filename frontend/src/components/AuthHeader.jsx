import React from 'react';
import { Link } from 'react-router-dom';
import wavexLogo from '../assets/wavex-logo.jpg';

export default function AuthHeader({ title, subtitle }) {
    return (
        <div className="flex flex-col items-center text-center mb-8">
            {/* Branding and Logo Link */}
            <Link to="/" className="flex items-center gap-3 group mb-6 hover:opacity-90 transition-opacity">
                <img 
                    src={wavexLogo} 
                    alt="WaveX Logo" 
                    className="h-9 w-9 object-cover rounded-xl shadow-lg shadow-blue-500/10 group-hover:scale-105 transition-transform duration-300" 
                />
                <span className="text-2xl font-black tracking-tight text-white font-sans select-none">
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
