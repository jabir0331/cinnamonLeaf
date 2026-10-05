// client/src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { toast } from 'react-toastify';
import { loginUser, googleAuth } from '../services/auth';
import { getPostLoginPath, AuthRedirectState } from '../utils/authRedirect';
import logo from "../assets/images/cinnamonLeafLogo.png"
import loginBackground from "../assets/images/loginBg.png";
import { apiServerMessage } from '../utils/errors';

interface FormData {
    email: string;
    password: string;
}

interface FormErrors {
    email?: string;
    password?: string;
}

const LoginPage: React.FC = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const redirectState = location.state as AuthRedirectState | null;

    // Return to the page the user came from (e.g. /menu); fall back to home on a direct visit
    const goBack = () => (location.key !== 'default' ? navigate(-1) : navigate('/'));

    const goAfterLogin = (role?: string) =>
        navigate(getPostLoginPath(redirectState, role), { state: { resumeCheckout: redirectState?.resumeCheckout } });

    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password is too short';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const { email, password } = formData;

            // Call backend login API
            const data = await loginUser({ email, password });

            toast.success('Login Successful!');
            console.log('Login response:', data);

            // Store token in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.user?.role || 'user');

            // Reset form
            setFormData({
                email: '',
                password: ''
            });


            goAfterLogin(data.user?.role);
        } catch (err) {
            toast.error(apiServerMessage(err) || 'Invalid credentials');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
        if (!credentialResponse.credential) {
            toast.error('Google sign-in failed. Please try again.');
            return;
        }

        try {
            const data = await googleAuth(credentialResponse.credential);

            toast.success('Login Successful!');

            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.user?.role || 'user');

            goAfterLogin(data.user?.role);
        } catch (err) {
            toast.error(apiServerMessage(err) || 'Google sign-in failed');
            console.error(err);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 bg-cover bg-left-top bg-no-repeat"
            style={{ backgroundImage: `url(${loginBackground})` }}
        >

            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-sage-green-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="relative flex items-center justify-center mb-4">
                        <button
                            type="button"
                            onClick={goBack}
                            aria-label="Go back"
                            className="absolute left-0 inline-flex items-center justify-center w-10 h-10 bg-cream-100 hover:bg-cream-200 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-warm-brown-700" />
                        </button>
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-warm-brown-100 rounded-full">
                            <img src={logo} alt="Cinnamon Leaf Logo" className='rounded-full' />
                        </div>
                    </div>
                    <h1 className="text-3xl font-display font-bold text-warm-brown-800 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-sage-green-600 font-body">
                        Login to continue your culinary journey
                    </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-warm-brown-700 mb-2 flex">
                            Email Address <span className='text-red-600 ml-2'>*</span>
                            {errors.email && (
                                <span className="ml-1 text-sm text-red-600 font-body">{errors.email}</span>
                            )}
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-green-400" />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full pl-11 pr-4 py-3 text-sm border rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-warm-brown-500 focus:border-transparent transition-all ${errors.email ? 'border-red-400 bg-red-50' : 'border-sage-green-200 bg-cream-50'
                                    }`}
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-warm-brown-700 mb-2 flex">
                            Password <span className='text-red-600 ml-2'>*</span>
                            {errors.password && (
                                <span className="ml-1 text-sm text-red-600 font-body">{errors.password}</span>
                            )}
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-green-400" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                className={`w-full pl-11 pr-11 py-3 text-sm border rounded-lg font-body focus:outline-none focus:ring-2 focus:ring-warm-brown-500 focus:border-transparent transition-all ${errors.password ? 'border-red-400 bg-red-50' : 'border-sage-green-200 bg-cream-50'
                                    }`}
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sage-green-400 hover:text-sage-green-600 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 rounded-lg font-body font-semibold text-white transition-all transform hover:scale-[1.02] focus:ring-4 focus:ring-warm-brown-200 ${isSubmitting
                            ? 'bg-sage-green-300 cursor-not-allowed'
                            : 'bg-gradient-to-r from-warm-brown-500 to-warm-brown-600 hover:from-warm-brown-600 hover:to-warm-brown-700 shadow-lg hover:shadow-xl'
                            }`}
                    >
                        {isSubmitting ? (
                            <div className="flex items-center justify-center">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Signing In...
                            </div>
                        ) : (
                            <div className="flex items-center justify-center">
                                Login
                            </div>
                        )}
                    </button>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-sage-green-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-sage-green-500 font-body">or</span>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error('Google sign-in failed. Please try again.')}
                            theme="outline"
                            shape="pill"
                            width="320"
                        />
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center">
                        <p className="text-sage-green-600 font-body">
                            Don't have an account?{' '}
                            <Link to="/signup" state={redirectState} replace>
                                <button
                                    type="button"
                                    className="text-warm-brown-600 hover:text-warm-brown-700 font-semibold transition-colors hover:underline"
                                >
                                    Sign Up here
                                </button>
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Terms and Privacy */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-sage-green-500 font-body">
                        By loging in, you agree to our{' '}
                        <button className="text-warm-brown-600 hover:underline">Terms of Service</button>
                        {' '}and{' '}
                        <button className="text-warm-brown-600 hover:underline">Privacy Policy</button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;