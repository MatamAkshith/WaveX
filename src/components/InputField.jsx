import React from 'react';

export default function InputField({
    label,
    id,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    required = false,
    ...props
}) {
    return (
        <div className="flex flex-col gap-2 w-full text-left">
            <label htmlFor={id} className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                {label} {required && <span className="text-rose-500">*</span>}
            </label>

            <input
                type={type}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className={`w-full px-4 py-3 rounded-xl bg-white/[0.02] border focus:bg-white/[0.05] outline-none text-white text-sm transition-all duration-200 placeholder:text-gray-600 ${error
                        ? 'border-rose-500/50 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20'
                        : 'border-white/10 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20'
                    }`}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
                {...props}
            />

            {error && (
                <span id={`${id}-error`} className="text-xs text-rose-500 font-medium tracking-wide mt-1">
                    {error}
                </span>
            )}
        </div>
    );
}
