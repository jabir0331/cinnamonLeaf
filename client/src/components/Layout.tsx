import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Facebook, Instagram } from 'lucide-react';
import logo from '../assets/images/cinnamonLeafLogo.png'
import Footer from './Footer';
import { useScrollToTop } from '../hooks/useScrollToTop';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  // Scroll to top on route change
  useScrollToTop();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/menu', label: 'Menu' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/testimonials', label: 'Testimonials' },
    { path: '/contact', label: 'Contact Us' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src = {logo} alt = 'CinnamonLeaf Logo' style = { {height: '50px', borderRadius: '50%'} }/>
              <div>
                <h1 className="font-display text-xl md:text-2xl text-warm-brown-700 font-bold">
                  Cinnamon&nbsp;
                  <span className="font-display text-xl md:text-2xl text-sage-green-700 font-bold">
                    Leaf
                  </span>
                </h1>

              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-10">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-body text-m font-medium transition-colors duration-300 ${
                    location.pathname === link.path
                      ? 'text-sage-green-600 border-b-2 border-sage-green-600'
                      : 'text-warm-brown-600 hover:text-sage-green-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Reserve Button & Contact */}
            <div className="hidden md:flex items-center space-x-4">
              {/* <a href="tel:+1234567890" className="flex items-center text-warm-brown-600 hover:text-sage-green-600 transition-colors">
                <Phone className="w-4 h-4 mr-1" />
                <span className="text-sm">(123) 456-7890</span>
              </a> */}
              <Link
                to="/reservation"
                className="bg-sage-green-600 text-white px-7 py-2 rounded-full font-medium hover:bg-sage-green-700 transition-colors duration-200"
              >
                Reserve a Table
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-warm-brown-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2 font-body text-base ${
                    location.pathname === link.path
                      ? 'text-sage-green-600 font-semibold'
                      : 'text-warm-brown-600'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t space-y-3">
                
                <Link
                  to="/reservation"
                  className="block w-full bg-sage-green-600 text-white text-center px-6 py-3 rounded-full font-medium"
                >
                  Reserve a Table
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-16 md:pt-20">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;