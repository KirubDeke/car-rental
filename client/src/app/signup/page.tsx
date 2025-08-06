'use client';

import { useState } from 'react';
import { Lock, Mail, User, Eye, EyeOff, CarFront } from 'lucide-react';
import Image from 'next/image';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

const AuthForm = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });
    const [passwordMatch, setPasswordMatch] = useState(true);
    const [rememberMe, setRememberMe] = useState(false);

    const toggleForm = () => {
        setIsLogin(!isLogin);
        setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
        });
        setPasswordMatch(true);
    };
    const { login, signup } = useAuth();
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'phone') {
            const digitsOnly = value.replace(/\D/g, '');
            if (digitsOnly.length <= 9) {
                setFormData(prev => ({ ...prev, [name]: digitsOnly }));
            }
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'password' || name === 'confirmPassword') {
            setPasswordMatch(
                name === 'password'
                    ? value === formData.confirmPassword
                    : value === formData.password
            );
        }
    };

    const handleLogin = async (loginData: { email: string; password: string; rememberMe: boolean }) => {
        try {
            await login(loginData.email, loginData.password);
            toast.success("SignIn Successful");
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
            });
            router.push("/home");
        } catch (error) {
            toast.error("SignIn Failed");
        }
    };

    const handleSignup = async (signupData: {
        fullName: string;
        email: string;
        phoneNumber: string;
        password: string;
    }) => {
        try {
            await signup({
                fullName: signupData.fullName,
                email: signupData.email,
                phoneNumber: signupData.phoneNumber,
                password: signupData.password,
            });
            toast.success("SignUp Successful");
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                confirmPassword: ''
            });
            router.push("/home");
        } catch (error) {
            toast.error("SignUp Failed");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isLogin && formData.password !== formData.confirmPassword) {
            setPasswordMatch(false);
            return;
        }

        if (isLogin) {
            await handleLogin({
                email: formData.email,
                password: formData.password,
                rememberMe,
            });
        } else {
            await handleSignup({
                fullName: formData.name,
                email: formData.email,
                phoneNumber: formData.phone,
                password: formData.password,
            });
        }
    };

    return (
        <div className="min-h-screen bg-background dark:bg-background dark:to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <div className="rounded-lg">
                        <div
                            className="flex items-center space-x-2 text-2xl font-semibold whitespace-nowrap dark:text-white"
                            style={{ fontFamily: 'Orbitron, sans-serif' }}
                        >
                            <CarFront size={42} />
                            <h2>Kirub</h2>
                            <span className="text-red-500">Rental</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-4 font-medium text-center transition-colors ${isLogin ? 'bg-red-500 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-4 font-medium text-center transition-colors ${!isLogin ? 'bg-red-500 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
                            {isLogin ? 'Welcome Back!' : 'Create Account'}
                        </h2>

                        <form onSubmit={handleSubmit}>
                            {!isLogin && (
                                <>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="name">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="phone">
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <div className="flex items-center">
                                                    <span className="text-gray-400 mr-1">🇪🇹</span>
                                                    <span className="text-gray-400">+251</span>
                                                </div>
                                            </div>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="w-full pl-16 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="912345678"
                                                pattern="[0-9]{9}"
                                                title="Ethiopian phone number (9 digits after +251)"
                                                required
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                            Enter 9 digits after +251
                                        </p>
                                    </div>
                                </>
                            )}

                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {!isLogin && (
                                <div className="mb-6">
                                    <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="confirmPassword">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-10 py-2 border ${passwordMatch ? 'border-gray-300 dark:border-gray-600' : 'border-red-500'} rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
                                            placeholder="••••••••"
                                            required
                                            minLength={6}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    {!passwordMatch && (
                                        <p className="mt-1 text-sm text-red-500">Passwords do not match</p>
                                    )}
                                </div>
                            )}

                            {isLogin && (
                                <div className="flex items-center justify-between mb-6">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className="form-checkbox h-4 w-4 text-red-500 focus:ring-red-500 border-gray-300 rounded"
                                        />
                                        <span className="ml-2 text-gray-700 dark:text-gray-300">Remember me</span>
                                    </label>
                                    <a href="#" className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400">
                                        Forgot password?
                                    </a>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                {isLogin ? 'Sign In' : 'Sign Up'}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600 dark:text-gray-400">
                                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                                <button
                                    type="button"
                                    onClick={toggleForm}
                                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 font-medium"
                                >
                                    {isLogin ? 'Sign up' : 'Sign in'}
                                </button>
                            </p>
                        </div>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    <Image
                                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                                        alt="Google"
                                        width={20}
                                        height={20}
                                        className="h-5 w-5"
                                    />
                                    <span className="ml-2">Google</span>
                                </button>
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    <Image
                                        src="https://upload.wikimedia.org/wikipedia/commons/f/ff/Facebook_logo_36x36.svg"
                                        alt="Facebook"
                                        width={20}
                                        height={20}
                                        className="h-5 w-5"
                                    />
                                    <span className="ml-2">Facebook</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;