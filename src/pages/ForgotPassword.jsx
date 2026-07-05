import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import AuthCard from '../components/AuthCard';
import AuthHeader from '../components/AuthHeader';
import AuthFooter from '../components/AuthFooter';
import InputField from '../components/InputField';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const validate = () => {
        if (!email) {
            setError('Email address is required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError('Invalid email format');
            return false;
        }
        setError(null);
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col justify-center items-center p-6 relative overflow-hidden grid-bg">
            <div className="absolute inset-0 radial-mask pointer-events-none opacity-50" />

            <AuthCard>
                <AnimatePresence mode="wait">
                    {!isSuccess ? (
                        <motion.div
                            key="request-form"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                        >
                            <AuthHeader
                                title="Reset Password"
                                subtitle="Enter your email address and we'll send you a link to reset your password."
                            />

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <InputField
                                    label="Email Address"
                                    id="email"
                                    type="email"
                                    placeholder="founder@hightech.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (error) setError(null);
                                    }}
                                    required
                                    error={error}
                                    disabled={isLoading}
                                />

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full relative group overflow-hidden px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm shadow-xl shadow-violet-500/10 hover:shadow-violet-600/35 transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                                >
                                    {isLoading ? (
                                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                                    ) : (
                                        <>
                                            Send Reset Link
                                        </>
                                    )}
                                </button>

                                <div className="pt-2 text-center">
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white font-semibold transition-colors"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to Login
                                    </Link>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="success-screen"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.3 }}
                            className="text-center py-4"
                        >
                            {/* Success Checkmark Ring */}
                            <div className="flex justify-center mb-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                    className="h-16 w-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400"
                                >
                                    <Check className="h-8 w-8 stroke-[3]" />
                                </motion.div>
                            </div>

                            <h1 className="text-2xl font-extrabold tracking-tight text-white mb-3">
                                Check Your Email
                            </h1>
                            <p className="text-gray-400 text-sm leading-relaxed max-w-sm mx-auto mb-8">
                                We've sent a password reset link to <span className="text-white font-semibold">{email}</span>. Click the link in the email to set a new password.
                            </p>

                            <div className="pt-4 border-t border-white/5 space-y-4">
                                <p className="text-xs text-gray-500 leading-normal">
                                    Didn't receive the email? Check your spam folder or try again.
                                </p>
                                <button
                                    onClick={() => setIsSuccess(false)}
                                    className="text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors"
                                >
                                    Resend Email
                                </button>
                            </div>

                            <div className="pt-6 text-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white font-semibold transition-colors"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Login
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AuthFooter />
            </AuthCard>
        </div>
    );
}
