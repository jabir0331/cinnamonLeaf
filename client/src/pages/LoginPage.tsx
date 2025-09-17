// client/src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { loginUser } from '../services/auth';
import logo from "../assets/images/cinnamonLeafLogo.png"

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

    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

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

            // Reset form
            setFormData({
                email: '',
                password: ''
            });

            
            navigate("/");
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Invalid credentials');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-50 to-sage-green-50 flex items-center justify-center p-4">
           
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-sage-green-100">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-warm-brown-100 rounded-full mb-4">
                        <img src={logo} alt="Cinnamon Leaf Logo" className='rounded-full' />
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
                                className={`w-full pl-11 pr-4 py-3 text-sm border rounded-lg font-body focus:ring-2 focus:ring-warm-brown-500 focus:border-transparent transition-all ${errors.email ? 'border-red-400 bg-red-50' : 'border-sage-green-200 bg-cream-50'
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
                                className={`w-full pl-11 pr-11 py-3 text-sm border rounded-lg font-body focus:ring-2 focus:ring-warm-brown-500 focus:border-transparent transition-all ${errors.password ? 'border-red-400 bg-red-50' : 'border-sage-green-200 bg-cream-50'
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

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 text-warm-brown-600 bg-cream-50 border-sage-green-300 rounded focus:ring-warm-brown-500 focus:ring-2"
                            />
                            <span className="ml-2 text-sm text-sage-green-600 font-body">Remember me</span>
                        </label>
                        <button
                            type="button"
                            className="text-sm text-warm-brown-600 hover:text-warm-brown-700 font-semibold transition-colors hover:underline"
                        >
                            Forgot password?
                        </button>
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
                    {/* <div className="space-y-3">
                        <button
                            type="button"
                            className="w-full flex items-center justify-center px-4 py-3 border border-sage-green-200 rounded-lg bg-white hover:bg-cream-50 transition-colors font-body font-medium text-warm-brown-700"
                        >
                            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                    </div> */}

                    {/* Sign Up Link */}
                    <div className="text-center">
                        <p className="text-sage-green-600 font-body">
                            Don't have an account?{' '}
                            <Link to="/signup" >
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