import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import logo from '../assets/images/cinnamonLeafLogo.png';

const NotFound: React.FC = () => {
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
                    404
                </p>

                {/* Icon + Header */}
                <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-warm-brown-100 flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-warm-brown-700" />
                    </div>
                    <h1 className="font-display text-2xl md:text-3xl font-bold text-warm-brown-800">
                        Page Not Found
                    </h1>
                </div>

                {/* Sub Header */}
                <p className="text-sage-green-600 font-body mb-8">
                    The page you're looking for doesn't exist or may have been moved.
                </p>

                {/* Action Button */}
                <div className="flex justify-center">
                    <button
                        onClick={goHome}
                        className="flex items-center justify-center gap-2 bg-sage-green-600 hover:bg-sage-green-700 text-white font-body font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                    >
                        <Home size={16} />
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
