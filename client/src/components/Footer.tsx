import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react';
import './Footer.css'
import logo from '../assets/images/cinnamonLeafLogo.png'

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" }
  ];

  const quickLinks = [
    { label: "Home", href: "#" },
    { label: "Menu", href: "#menu" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
    { label: "Reservations", href: "#reservations" }
  ];

  return (
    <footer className="mt-20 bg-gradient-to-br from-warm-brown-800 to-warm-brown-900 text-cream-100 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-sage-green-400 to-transparent transform -skew-y-1"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          
          {/* Brand Section */}
          <div className="lg:col-span-2 footer-section">
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={logo} 
                  alt="CinnamonLeaf Logo" 
                  className="h-12 w-12 rounded-full border-2 border-sage-green-400 shadow-lg"
                />
                <h2 className="font-display text-2xl font-bold text-sage-green-400 tracking-tight">
                  Cinnamon Leaf
                </h2>
              </div>
              <div className="w-10 h-1 bg-gradient-to-r from-sage-green-400 to-cream-400 rounded-full mb-4"></div>
            </div>
            
            <p className="text-cream-200 mb-6 max-w-md leading-relaxed text-sm text-justify">
              Experience authentic and fusion dishes in our cozy, welcoming atmosphere. 
              A perfect spot for families, young professionals, and tourists seeking exceptional dining.
            </p>
            
            <div className="flex space-x-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="group flex items-center justify-center w-10 h-10 bg-sage-green-400/10 border border-sage-green-400/20 rounded-full text-sage-green-400 hover:text-cream-100 hover:bg-sage-green-500/40 hover:border-sage-green-400/60 transform hover:-translate-y-1 transition-all duration-300 ease-out relative overflow-hidden"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sage-green-400/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                  <Icon size={18} className="relative z-10" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="font-body font-semibold text-lg text-sage-green-400 mb-5 relative">
              Quick Links
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-cream-400 to-transparent rounded"></div>
            </h3>
            <ul className="space-y-0">
              {quickLinks.map(({ label, href }) => (
                <li key={label}>
                  <a 
                    href={href} 
                    className="group inline-block text-cream-200 hover:text-cream-400 transition-all duration-300 ease-out text-sm py-2 relative"
                  >
                    <span className="relative">
                      {label}
                      <div className="absolute left-0 -bottom-1 w-0 h-0.5 bg-cream-400 group-hover:w-full transition-all duration-300"></div>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="font-body font-semibold text-lg text-sage-green-400 mb-5 relative">
              Contact Info
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-cream-400 to-transparent rounded"></div>
            </h3>
            <div className="space-y-4">
              <div className="group flex items-start space-x-3 text-cream-200 hover:text-cream-100 transition-colors duration-300">
                <Phone size={16} className="mt-0.5 text-cream-300 group-hover:text-cream-400 flex-shrink-0" />
                <span className="text-sm">+94 77 723 3133</span>
              </div>
              <div className="group flex items-start space-x-3 text-cream-200 hover:text-cream-100 transition-colors duration-300">
                <Mail size={16} className="mt-0.5 text-cream-300 group-hover:text-cream-400 flex-shrink-0" />
                <span className="text-sm">info@cinnamonleaf.com</span>
              </div>
              
             
            </div>
          </div>

          <div className="footer-section">
            <h3 className="font-body font-semibold text-lg text-sage-green-400 mb-5 relative">
              Location
              <div className="absolute -bottom-2 left-0 w-8 h-0.5 bg-gradient-to-r from-cream-400 to-transparent rounded"></div>
            </h3>
            <div className="space-y-4">
              <div className="group flex items-start space-x-3 text-cream-200 hover:text-cream-100 transition-colors duration-300 ">
                <MapPin size={16} className="mt-0.5 text-cream-300 group-hover:text-cream-400 flex-shrink-0" />
                <span className="text-sm leading-relaxed">32 Galle, <br />Elpitiya Rd,<br />Kurundugahahetekma</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-warm-brown-700/50 pt-6 text-center">
          <p className="text-cream-300 text-sm leading-relaxed">
            © {currentYear} Cinnamon Leaf Restaurant. All rights reserved.
          </p>
        </div>
      </div>

      
    </footer>
  );
};

export default Footer;