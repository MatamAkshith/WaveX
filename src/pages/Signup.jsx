import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import AuthCard from '../components/AuthCard';
import AuthHeader from '../components/AuthHeader';
import AuthFooter from '../components/AuthFooter';
import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';
import SocialLoginButton from '../components/SocialLoginButton';
import { googleAuth } from '../lib/api';

export default function Signup() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);

    // States
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastType, setToastType] = useState('success');

    // Password strength calculation
    useEffect(() => {
        let score = 0;
        if (password.length >= 6) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/[0-9]/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        setPasswordStrength(score);
    }, [password]);

    const validate = () => {
        const tempErrors = {};
        if (!fullName.trim()) {
            tempErrors.fullName = 'Full Name is required';
        }

        if (!email) {
            tempErrors.email = 'Email address is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            tempErrors.email = 'Invalid email format';
        }

        if (!password) {
            tempErrors.password = 'Password is required';
        } else if (password.length < 6) {
            tempErrors.password = 'Password must be at least 6 characters';
        }

        if (!confirmPassword) {
            tempErrors.confirmPassword = 'Confirmation password is required';
        } else if (password !== confirmPassword) {
            tempErrors.confirmPassword = 'Passwords do not match';
        }

        if (!agreeTerms) {
            tempErrors.agreeTerms = 'You must agree to the Terms and Privacy Policy';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        setToastType('success');
        setTimeout(() => {
            setIsLoading(false);
            setToastMessage('Workspace created successfully! Preparing dashboard...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        }, 1800);
    };

    const handleGoogleSignup = async () => {
        setToastMessage(null);
        try {
            setToastType('success');
            const res = await googleAuth({
                email: 'akshaykumarcherry@gmail.com',
                full_name: 'Akshay Kumar',
                avatar_url: null,
            });
            setToastMessage(`Welcome${res.onboarded ? ' back' : ''}, ${res.full_name}!`);
            setTimeout(() => {
                navigate(res.onboarded ? '/dashboard' : '/onboarding');
            }, 900);
        } catch (err) {
            setToastType('info');
            setToastMessage(`Sign-in failed: ${err.message}. Is the backend running?`);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0B0B] text-white flex flex-col justify-center items-center p-6 relative overflow-hidden grid-bg">
            <div className="absolute inset-0 radial-mask pointer-events-none opacity-50" />

            {/* Floating toast notification wrapper */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        className={`fixed top-8 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-xl border max-w-sm backdrop-blur-md shadow-xl ${toastType === 'info'
                                ? 'bg-violet-500/10 border-violet-500/30 text-violet-400 shadow-violet-500/5'
                                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/5'
                            }`}
                    >
                        {toastType === 'info' ? <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" /> : <CheckCircle2 className="h-4.5 w-4.5 flex-shrink-0" />}
                        <span className="text-xs leading-relaxed font-medium">{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <AuthCard>
                <AuthHeader
                    title="Create Workspace"
                    subtitle="Start making coordinate, data-driven decisions with WaveX."
                />

                <form onSubmit={handleSubmit} className="space-y-4">
                    <InputField
                        label="Full Name"
                        id="fullName"
                        placeholder="Sarah Jenkins"
                        value={fullName}
                        onChange={(e) => {
                            setFullName(e.target.value);
                            if (errors.fullName) setErrors({ ...errors, fullName: null });
                        }}
                        required
                        error={errors.fullName}
                        disabled={isLoading}
                    />

                    <InputField
                        label="Email Address"
                        id="email"
                        type="email"
                        placeholder="founder@hightech.com"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors({ ...errors, email: null });
                        }}
                        required
                        error={errors.email}
                        disabled={isLoading}
                    />

                    <PasswordField
                        label="Password"
                        id="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors({ ...errors, password: null });
                        }}
                        required
                        error={errors.password}
                        strength={passwordStrength}
                        disabled={isLoading}
                    />

                    <PasswordField
                        label="Confirm Password"
                        id="confirmPassword"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null });
                        }}
                        required
                        error={errors.confirmPassword}
                        disabled={isLoading}
                    />

                    <div className="flex flex-col text-left py-1">
                        <label className="flex items-start gap-2.5 text-xs text-gray-400 hover:text-white cursor-pointer select-none leading-tight">
                            <input
                                type="checkbox"
                                checked={agreeTerms}
                                onChange={(e) => {
                                    setAgreeTerms(e.target.checked);
                                    if (errors.agreeTerms) setErrors({ ...errors, agreeTerms: null });
                                }}
                                disabled={isLoading}
                                className="mt-0.5 rounded border-white/10 bg-white/[0.02] text-violet-600 focus:ring-offset-0 focus:ring-1 focus:ring-violet-500/30"
                            />
                            <span>
                                I agree to the{' '}
                                <a href="#" className="text-violet-400 hover:underline font-medium">Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="text-violet-400 hover:underline font-medium">Privacy Policy</a>.
                            </span>
                        </label>
                        {errors.agreeTerms && (
                            <span className="text-xs text-rose-500 font-medium tracking-wide mt-1.5">
                                {errors.agreeTerms}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full relative group overflow-hidden px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm shadow-xl shadow-violet-500/10 hover:shadow-violet-600/35 transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                        ) : (
                            <>
                                Create Workspace
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="relative flex items-center justify-center my-5">
                        <div className="absolute inset-x-0 h-px bg-white/10" />
                        <span className="relative z-10 px-4 text-xs font-bold text-gray-500 uppercase bg-[#141414] tracking-widest">
                            OR
                        </span>
                    </div>

                    <SocialLoginButton onClick={handleGoogleSignup} label="Sign up with Google" />

                    <p className="text-center text-sm text-gray-400 mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                            Log in
                        </Link>
                    </p>
                </form>

                <AuthFooter />
            </AuthCard>
        </div>
    );
}
