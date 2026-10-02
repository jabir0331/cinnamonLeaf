import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, User } from 'lucide-react';
import { toast } from 'react-toastify';
import DisplayTime from './DisplayTime';
import { logoutUser } from '../../../services/auth';
import { clearStoredCart } from '../../../utils/cartStorage';

interface HeaderProps {
  headerText: string;
  sidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ headerText, sidebarOpen }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    try {
      if (token) await logoutUser(token);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      clearStoredCart();
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  return (
    <header
      className={`fixed top-0 z-30 bg-white shadow-sm border-b border-warm-brown-200 transition-all duration-300 ${
        sidebarOpen ? 'left-72' : 'left-16'
      } right-0`}
    >
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
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex items-center space-x-3 rounded-lg px-2 py-1.5 hover:bg-warm-brown-50 transition-colors duration-200"
            >
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">Admin</p>
                <p className="text-xs text-gray-500">Restaurant Manager</p>
              </div>
              <div className="w-10 h-10 bg-sage-green-500 rounded-full flex items-center justify-center">
                <User size={20} className="text-white" />
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-400 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-warm-brown-100 py-1 z-40">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-body text-warm-brown-700 hover:bg-warm-brown-50 transition-colors duration-200"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
