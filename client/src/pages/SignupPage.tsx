// client/src/pages/SignupPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';
import { signupUser } from '../services/auth';
import logo from "../assets/images/cinnamonLeafLogo.png"

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

const SignupPage: React.FC = () => {

  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!phoneRegex.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Invalid phone number';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = '8+ chars required';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords don\'t match';
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
      const { name, email, phone, password } = formData;

      // Call backend signup API
      const data = await signupUser({ name, email, phone, password });

      toast.success('Account created successfully!');
      console.log('Signup response:', data);

      // Optionally store token in localStorage
      localStorage.setItem('token', data.token);

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });

      // Redirect to dashboard after successful signup
      navigate("/");

    } catch (err: any) {
      console.error('Signup error:', err);

      // More specific error handling
      if (err.response?.data?.error) {
        toast.error(err.response.data.error);
      } else if (err.message) {
        toast.error(err.message);
      } else {
        toast.error('Failed to create account. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-sage-green-50 flex items-center justify-center p-4">
     
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl p-8 border border-sage-green-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-warm-brown-100 rounded-full mb-4">
            {/* <UserPlus className="w-8 h-8 text-warm-brown-600" /> */}
            <img src={logo} alt="Cinnamon Leaf Logo" className='rounded-full' />
          </div>
          <h1 className="text-3xl font-display font-bold text-warm-brown-800 mb-2">
            Create Account
          </h1>
          <p className="text-sage-green-600 font-body">
            Start savoring delicious moments with us
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Name Field - Full Width */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-warm-brown-700 mb-2 flex">
              Full Name <span className='text-red-600 ml-2'>*</span>
              {errors.name && (
                <span className="ml-1 text-sm text-red-600 font-body">{errors.name}</span>
              )}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-green-400" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full pl-11 pr-4 py-3 text-sm border rounded-lg font-body focus:ring-2 focus:ring-warm-brown-500 focus:border-transparent transition-all ${errors.name ? 'border-red-400 bg-red-50' : 'border-sage-green-200 bg-cream-50'
                  }`}
                placeholder="Enter your full name"
              />
            </div>
          </div>

          {/* Email and Phone Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-warm-brown-700 mb-2 flex">
                Email <span className='text-red-600 ml-2'>*</span>
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

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-warm-brown-700 mb-2 flex">
                Phone <span className='text-red-600 ml-2'>*</span>
                {errors.phone && (
                  <p className="ml-1 text-sm text-red-600 font-body">{errors.phone}</p>
                )}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-green-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-4 py-3 text-sm border rounded-lg font-body focus:ring-2 focus:ring-warm-brown-500 focus:border-transparent transition-all ${errors.phone ? 'border-red-400 bg-red-50' : 'border-sage-green-200 bg-cream-50'
                    }`}
                  placeholder="+94 71 123 4567"
                />
              </div>
            </div>
          </div>

          {/* Password and Confirm Password Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
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
                  placeholder="••••••••"
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

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-warm-brown-700 mb-2 flex">
                Confirm <span className='text-red-600 ml-2'>*</span>
                {errors.confirmPassword && (
                  <span className="ml-1 text-sm text-red-600 font-body">{errors.confirmPassword}</span>
                )}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-sage-green-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-11 py-3 text-sm border rounded-lg font-body focus:ring-2 focus:ring-warm-brown-500 focus:border-transparent transition-all ${errors.confirmPassword ? 'border-red-400 bg-red-50' : 'border-sage-green-200 bg-cream-50'
                    }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sage-green-400 hover:text-sage-green-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
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
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sage-green-600 font-body">
              Already have an account?{' '}
              <Link to="/login">
                <button
                  type="button"
                  className="text-warm-brown-600 hover:text-warm-brown-700 font-semibold transition-colors hover:underline"
                >
                  Login here
                </button>
              </Link>
            </p>
          </div>
        </div>

        {/* Terms and Privacy */}
        <div className="mt-6 text-center">
          <p className="text-xs text-sage-green-500 font-body">
            By signing in, you agree to our{' '}
            <button className="text-warm-brown-600 hover:underline">Terms of Service</button>
            {' '}and{' '}
            <button className="text-warm-brown-600 hover:underline">Privacy Policy</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;