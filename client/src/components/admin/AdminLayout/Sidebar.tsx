import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  ChefHat, 
  ShoppingBag, 
  BarChart3
} from 'lucide-react';

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
    { id: 'menu', path: '/admin/menuManagement', label: 'Menu', icon: ChefHat },
    { id: 'orders', path: '/admin/orderManagement', label: 'Orders', icon: ShoppingBag },
    { id: 'customers', path: '/admin/customerManagement', label: 'Customers', icon: Users },
    { id: 'analytics', path: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const switchPage = (id: string, path: string) => {
    setActiveTab(id)
    navigate(path);
  }

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 z-30 h-full bg-warm-brown-800 text-white transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="flex items-center justify-between p-4">
          <h1 className={`font-display text-xl font-bold text-cream-200 transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          }`}>
            Cinnamon Leaf
          </h1>
          
        </div>
        
        <nav className="mt-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => switchPage(item.id, item.path)}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-warm-brown-700 transition-all duration-200 ${
                  activeTab === item.id ? 'bg-warm-brown-700 border-r-3 border-cream-400' : ''
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className={`ml-3 transition-opacity duration-300 ${
                  sidebarOpen ? 'opacity-100' : 'opacity-0'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;