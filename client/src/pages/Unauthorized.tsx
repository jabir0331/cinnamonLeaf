import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, LogIn, Home } from 'lucide-react';
import logo from '../assets/images/cinnamonLeafLogo.png';

const Unauthorized: React.FC = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const goHome = () => navigate(role === 'admin' ? '/admin/dashboard' : '/');

    return (
        <div className="min-h-screen bg-gradient-to-br from-cream-50 to-sage-green-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 md:p-12 border border-sage-green-100 text-center">
                {/* Brand Logo */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-warm-brown-100 rounded-full mb-6">
                    <img src={logo} alt="Cinnamon Leaf Logo" className="rounded-full" />
                </div>

                {/* Status Code */}
                <p className="font-display font-bold text-warm-brown-200 text-6xl md:text-7xl mb-6">
                    401
                </p>

                {/* Icon + Header */}
                <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-warm-brown-100 flex-shrink-0">
                        <Lock className="h-5 w-5 text-warm-brown-700" />
                    </div>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-warm-brown-800">
                        Login Required
                    </h1>
                </div>

                {/* Sub Header */}
                <p className="text-sage-green-600 font-body mb-8">
                    You need to log in to view this page.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="flex items-center justify-center gap-2 bg-sage-green-600 hover:bg-sage-green-700 text-white font-body font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        <LogIn size={16} />
                        Log In
                    </button>

                    <button
                        onClick={goHome}
                        className="flex items-center justify-center gap-2 bg-warm-brown-100 hover:bg-warm-brown-200 text-warm-brown-700 font-body font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        <Home size={16} />
                        Go to Homepage
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
