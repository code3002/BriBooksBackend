import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Mail, Lock, User, Loader2 } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api/auth.service';
import toast from 'react-hot-toast';

interface UserData {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface GoogleCredentialResponse {
    credential?: string;
}

interface AppleResponse {
    authorization?: {
        id_token: string;
    };
    user?: {
        name?: {
            firstName: string;
            lastName: string;
        };
    };
}

interface ApiError {
    response?: {
        data?: {
            error?: {
                message?: string;
            };
            message?: string;
        };
        status?: number;
    };
    message?: string;
}

interface AppleIDAuth {
    auth: {
        signIn: () => Promise<AppleResponse>;
    };
}

export const SignupPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleOAuthSuccess = (token: string, userData: UserData) => {
        toast.success('Account ready!');
        login(token, userData);
        navigate('/');
    };

    const handleGoogleSuccess = async (credentialResponse: GoogleCredentialResponse) => {
        try {
            const res = await axios.post('/api/auth/google', { idToken: credentialResponse.credential });
            handleOAuthSuccess(res.data.data.token, res.data.data.user);
        } catch (err: unknown) {
            const error = err as ApiError;
            toast.error(error?.response?.data?.error?.message || 'Google sign-in failed');
        }
    };

    const handleAppleSuccess = async (response: AppleResponse) => {
        try {
            const res = await axios.post('/api/auth/apple', {
                idToken: response.authorization?.id_token,
                user: response.user ? {
                    firstName: response.user.name?.firstName,
                    lastName: response.user.name?.lastName,
                } : undefined,
            });
            handleOAuthSuccess(res.data.data.token, res.data.data.user);
        } catch (err: unknown) {
            const error = err as ApiError;
            toast.error(error?.response?.data?.error?.message || 'Apple sign-in failed');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await authService.register(name, email, password);

            toast.success('Account created successfully!');

            // FIX: Backend returns {success: true, data: {token, user}}
            const { token, user: userData } = response.data;
            login(token, userData);
            navigate('/');
        } catch (err: unknown) {
            console.error('Signup Error:', err);
            const error = err as ApiError;
            if (error.response) {
                console.error('Error Response:', error.response.data);
                console.error('Error Status:', error.response.status);
            }
            setError(error.response?.data?.error?.message || error.message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                <div className="text-center">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                            <BookOpen className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-slate-900">
                            BriBooks<span className="text-primary">.</span>
                        </span>
                    </Link>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Create an account</h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary hover:text-primary-hover transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* OAuth Buttons */}
                <div className="mt-6 space-y-3">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => toast.error('Google sign-in failed')}
                        width="100%"
                        text="signup_with"
                        shape="rectangular"
                    />
                    <button
                        type="button"
                        onClick={() => {
                            const AppleID = (window as unknown as { AppleID?: AppleIDAuth }).AppleID;
                            if (!AppleID) { toast.error('Apple Sign-In not loaded'); return; }
                            AppleID.auth.signIn().then(handleAppleSuccess).catch(() => toast.error('Apple sign-in failed'));
                        }}
                        className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-slate-300 rounded-lg bg-black text-white hover:bg-slate-800 transition-colors font-medium text-sm"
                    >
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                        Sign up with Apple
                    </button>
                </div>

                <div className="relative mt-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-3 bg-white text-slate-500">Or sign up with email</span>
                    </div>
                </div>

                <form className="mt-4 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <User className="h-5 w-5" />
                            </div>
                            <Input
                                type="text"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Mail className="h-5 w-5" />
                            </div>
                            <Input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                <Lock className="h-5 w-5" />
                            </div>
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
};
