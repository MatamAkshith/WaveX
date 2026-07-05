import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import AuthCard from '../components/AuthCard';
import AuthHeader from '../components/AuthHeader';
import AuthFooter from '../components/AuthFooter';
import InputField from '../components/InputField';
import PasswordField from '../components/PasswordField';
import SocialLoginButton from '../components/SocialLoginButton';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Validation / States
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastType, setToastType] = useState('success');

    const validate = () => {
        const tempErrors = {};
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

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        setIsLoading(true);
        setToastType('success');
        // Simulated auth delay
        setTimeout(() => {
            setIsLoading(false);
            setToastMessage('Authentication successful! Welcome to WaveX.');

            // Delay navigation to let the success toast be visible
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        }, 1800);
    };

    const handleGoogleLogin = () => {
        setToastMessage(null);
        setTimeout(() => {
            setToastType('info');
            setToastMessage('Google Sign-In is not available in this prototype. Backend OAuth integration will be implemented in a future version.');
        }, 50);
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
                    title="Welcome Back"
                    subtitle="Sign in to continue managing your startup decisions with confidence."
                />

                <form onSubmit={handleSubmit} className="space-y-5">
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

                    <div className="space-y-1.5 flex flex-col">
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
                            disabled={isLoading}
                        />

                        <div className="flex items-center justify-between text-xs mt-1">
                            <label className="flex items-center gap-2 text-gray-400 hover:text-white cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    disabled={isLoading}
                                    className="rounded border-white/10 bg-white/[0.02] text-violet-600 focus:ring-offset-0 focus:ring-1 focus:ring-violet-500/30"
                                />
                                Remember me
                            </label>

                            <Link
                                to="/forgot-password"
                                className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full relative group overflow-hidden px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-semibold text-sm shadow-xl shadow-violet-500/10 hover:shadow-violet-600/35 transition-all duration-300 hover:scale-[1.01] flex items-center justify-center gap-2 overflow-hidden disabled:opacity-50 disabled:scale-100 disabled:shadow-none"
                    >
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-white" />
                        ) : (
                            <>
                                Login
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                            </>
                        )}
                    </button>

                    <div className="relative flex items-center justify-center my-6">
                        <div className="absolute inset-x-0 h-px bg-white/10" />
                        <span className="relative z-10 px-4 text-xs font-bold text-gray-500 uppercase bg-[#141414] tracking-widest">
                            OR
                        </span>
                    </div>

                    <SocialLoginButton onClick={handleGoogleLogin} label="Continue with Google" />

                    <p className="text-center text-sm text-gray-400 mt-6">
                        New to WaveX?{' '}
                        <Link to="/signup" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                            Create Account Page
                        </Link>
                    </p>
                </form>

                <AuthFooter />
            </AuthCard>
        </div>
    );
}
