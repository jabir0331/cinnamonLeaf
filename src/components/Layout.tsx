import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Facebook, Instagram } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

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
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-sage-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <div>
                <h1 className="font-display text-xl md:text-2xl text-warm-brown-700 font-bold">
                  Cinnamon Leaf
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-body text-sm font-medium transition-colors duration-200 ${
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
              <a href="tel:+1234567890" className="flex items-center text-warm-brown-600 hover:text-sage-green-600 transition-colors">
                <Phone className="w-4 h-4 mr-1" />
                <span className="text-sm">(123) 456-7890</span>
              </a>
              <Link
                to="/contact"
                className="bg-sage-green-600 text-white px-6 py-2 rounded-full font-medium hover:bg-sage-green-700 transition-colors duration-200"
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
                <a href="tel:+1234567890" className="flex items-center text-warm-brown-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>(123) 456-7890</span>
                </a>
                <Link
                  to="/contact"
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

      {/* Footer */}
      <footer className="bg-warm-brown-800 text-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Restaurant Info */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-sage-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">C</span>
                </div>
                <h3 className="font-display text-xl font-bold">Cinnamon Leaf</h3>
              </div>
              <p className="text-cream-200 mb-4 max-w-md">
                Experience authentic and fusion dishes in our cozy, welcoming atmosphere. 
                A perfect spot for families, young professionals, and tourists.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-cream-200 hover:text-sage-green-400 transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-cream-200 hover:text-sage-green-400 transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-body font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="text-cream-200 hover:text-sage-green-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-body font-semibold mb-4">Contact</h4>
              <div className="text-cream-200 space-y-2">
                <p>123 Culinary Street<br />Food District, FD 12345</p>
                <p>Phone: (123) 456-7890</p>
                <p>Email: info@cinnamonleaf.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-warm-brown-700 mt-8 pt-8 text-center text-cream-300">
            <p>&copy; 2024 Cinnamon Leaf Restaurant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;