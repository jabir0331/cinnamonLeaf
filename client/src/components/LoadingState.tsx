import React from 'react';

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading menu details...",
  subMessage = "Fetching the menu details, please wait a moment"
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-cream-50 via-warm-brown-50 to-sage-green-50 p-6">
      <div className="relative mb-8">
        <div className="w-16 h-16 border-4 border-warm-brown-200 border-t-warm-brown-600 rounded-full animate-spin shadow-lg"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-sage-green-400 rounded-full animate-spin animate-reverse" style={{ animationDuration: '1.5s' }}></div>
      </div>
      <div className="text-center">
        <p className="mt-6 text-warm-brown-700 font-display text-2xl font-semibold">{message}</p>
        <p className="mt-2 text-warm-brown-500 font-body text-base">{subMessage}</p>
      </div>
    </div>
  );
};

export default LoadingState;