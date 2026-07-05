import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordField({
    label,
    id,
    placeholder = '••••••••',
    value,
    onChange,
    error,
    required = false,
    strength,
    ...props
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col gap-2 w-full text-left">
            <label htmlFor={id} className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>

            <div className="relative">
                <input
                    type={showPassword ? 'text' : 'password'}
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    className={`w-full pl-4 pr-11 py-3 rounded-xl bg-white/[0.02] border focus:bg-white/[0.05] outline-none text-white text-sm transition-all duration-200 placeholder:text-gray-600 ${error
                            ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                            : 'border-white/10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20'
                        }`}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${id}-error` : undefined}
                    {...props}
                />

                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    tabIndex={-1}
                >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
            </div>

            {error && (
                <span id={`${id}-error`} className="text-xs text-rose-500 font-medium tracking-wide mt-1">
                    {error}
                </span>
            )}

            {strength !== undefined && value.length > 0 && (
                <div className="mt-2.5 space-y-1.5Packed">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                        <span>Password Strength</span>
                        <span className={
                            strength <= 1 ? 'text-rose-400' : strength <= 3 ? 'text-amber-400' : 'text-emerald-400'
                        }>
                            {strength <= 1 ? 'Weak' : strength <= 3 ? 'Medium' : 'Strong'}
                        </span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 h-1 bg-white/5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${strength >= 1 ? (strength <= 1 ? 'bg-rose-500' : strength <= 3 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-transparent'
                            }`} />
                        <div className={`h-full rounded-full transition-all duration-300 ${strength >= 2 ? (strength <= 3 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-transparent'
                            }`} />
                        <div className={`h-full rounded-full transition-all duration-300 ${strength >= 3 ? (strength <= 3 ? 'bg-amber-500' : 'bg-emerald-500') : 'bg-transparent'
                            }`} />
                        <div className={`h-full rounded-full transition-all duration-300 ${strength >= 4 ? 'bg-emerald-500' : 'bg-transparent'
                            }`} />
                    </div>
                </div>
            )}
        </div>
    );
}
