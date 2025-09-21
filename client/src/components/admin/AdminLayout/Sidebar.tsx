import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ChefHat, 
  ShoppingBag, 
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import logo from "../../../assets/images/cinnamonLeafLogo.png";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  sidebarOpen, 
  setSidebarOpen 
}) => {

  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'menu', path: '/admin/menuManagement', label: 'Menu Management', icon: ChefHat },
    { id: 'orders', path: '/admin/orderManagement', label: 'Order Management', icon: ShoppingBag },
    { id: 'customers', path: '/admin/customerManagement', label: 'Customer Management', icon: Users },
    { id: 'analytics', path: '/admin/analytics', label: 'Analytics & Reports', icon: BarChart3 },
  ];

  const switchPage = (id: string, path: string) => {
    setActiveTab(id)
    navigate(path);
  }

  // Placeholder logo component - replace with your actual logo
  const BrandLogo = () => (
    <div className={`flex items-center justify-center transition-all duration-300 ${
      sidebarOpen ? 'w-12 h-12' : 'w-8 h-8'
    }`}>
      <div className="relative">
        {/* Cinnamon leaf icon - replace with your actual logo */}
        <div className={`bg-gradient-to-br from-cream-300 to-cream-400 rounded-full flex items-center justify-center transition-all duration-300 ${
          sidebarOpen ? 'w-12 h-12' : 'w-8 h-8'
        }`}>
          <img src = {logo} style={{borderRadius: '50%', height: '100%', width: '100%'}} className={`text-warm-brown-800 transition-all duration-300 ${
            sidebarOpen ? 'w-12 h-12' : 'w-8 h-8'
          }`} />
        </div>
        {/* Decorative ring */}
        {/* <div className="absolute inset-0 rounded-full border-2 border-cream-200/30"></div> */}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/50 backdrop-blur-sm lg:hidden transition-all duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 z-30 h-full bg-gradient-to-b from-warm-brown-800 to-warm-brown-900 text-white transition-all duration-300 shadow-2xl border-r border-warm-brown-700/50 ${
        sidebarOpen ? 'w-72' : 'w-16'
      }`}>
        
        {/* Brand Section */}
        <div className="relative">
          {/* Brand header with logo and name */}
          <div className="flex items-center gap-4 p-6 border-b border-warm-brown-700/50 bg-warm-brown-800/50">
            <BrandLogo />
            <div className={`transition-all duration-300 ${
              sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
            }`}>
              <h1 className="font-display text-xl font-bold text-cream-200 leading-tight">
                Cinnamon Leaf
              </h1>
              <p className="text-xs text-cream-300/70 font-body mt-1">
                Admin Dashboard
              </p>
            </div>
          </div>

          {/* Toggle button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute -right-3 top-8 bg-warm-brown-700 hover:bg-warm-brown-600 text-cream-200 rounded-full p-1.5 shadow-lg border border-warm-brown-600 transition-all duration-200 hover:scale-105 hidden lg:flex items-center justify-center"
          >
            {sidebarOpen ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="mt-6 px-3">
          
          
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => switchPage(item.id, item.path)}
                    className={`w-full flex items-center px-4 py-3.5 text-left rounded-xl transition-all duration-200 group relative overflow-hidden ${
                      isActive 
                        ? 'bg-gradient-to-r from-sage-green-600 to-sage-green-700 text-white shadow-lg shadow-sage-green-800/20' 
                        : 'text-cream-200 hover:bg-warm-brown-700/70 hover:text-white'
                    }`}
                  >
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-cream-300 rounded-r-full"></div>
                    )}
                    
                    {/* Icon container */}
                    <div className={`flex items-center justify-center w-5 h-5 transition-all duration-200 ${
                      isActive ? 'text-cream-100' : 'text-cream-300 group-hover:text-cream-100'
                    }`}>
                      <Icon size={20} className="flex-shrink-0" />
                    </div>
                    
                    {/* Label */}
                    <span className={`ml-4 font-body font-medium transition-all duration-300 ${
                      sidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    } ${
                      isActive ? 'text-cream-50' : 'text-cream-200 group-hover:text-cream-50'
                    }`}>
                      {item.label}
                    </span>

                    {/* Hover effect background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                  </button>

                  {/* Tooltip for collapsed state */}
                  {!sidebarOpen && (
                    <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-warm-brown-900 text-cream-200 px-3 py-2 rounded-lg shadow-xl border border-warm-brown-700 text-sm font-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 delay-500 z-50 whitespace-nowrap">
                      {item.label}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-warm-brown-900"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* Footer section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-warm-brown-700/50 bg-warm-brown-900/30">
          <div className={`flex items-center gap-3 transition-all duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="w-8 h-8 bg-gradient-to-br from-sage-green-500 to-sage-green-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">A</span>
            </div>
            <div>
              <p className="text-sm font-medium text-cream-200">Admin User</p>
              <p className="text-xs text-cream-300/70">Restaurant Manager</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;