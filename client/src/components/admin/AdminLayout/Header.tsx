import React from 'react';
import { User } from 'lucide-react';
import DisplayTime from './DisplayTime';

interface HeaderProps {
  headerText: string;
}

const Header: React.FC<HeaderProps> = ({headerText}) => {
  return (
    <header className="bg-white shadow-sm border-b border-warm-brown-200">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          
          <div className="relative ml-5">
            <h1 className="text-3xl font-display font-bold text-warm-brown-800">{headerText}</h1>
            <div className="text-sm text-gray-400 mt-1">
              <DisplayTime />
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">Admin</p>
              <p className="text-xs text-gray-500">Restaurant Manager</p>
            </div>
            <div className="w-10 h-10 bg-sage-green-500 rounded-full flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;