import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const adminTabs = [
    { id: 'dashboard', path: '/admin/dashboard', header: 'Dashboard Overview' },
    { id: 'menu', path: '/admin/menuManagement', header: 'Menu Management' },
    { id: 'orders', path: '/admin/orderManagement', header: 'Order Management' },
    { id: 'customers', path: '/admin/customerManagement', header: 'Customer Management' },
    { id: 'analytics', path: '/admin/analytics', header: 'Analytics Overview' },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {

    const location = useLocation();
    const [activeTab, setActiveTab] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const currentTab = adminTabs.find(tab => tab.path === location.pathname) || adminTabs[0];

    useEffect(() => {
        setActiveTab(currentTab.id);
    }, [location.pathname]);

    return (
        <div className="min-h-screen bg-warm-brown-50 font-body">
            <div className="flex">
                <Sidebar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                />
                <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
                    <Header headerText={currentTab.header} sidebarOpen={sidebarOpen} />
                    {/* <main className="mt-20 py-6 px-5">{children}</main> */}
                    <main className={`mt-20 py-6 px-5 ${sidebarOpen ? 'ml-10' : 'ml-3'
                        } right-0`}>{children}</main>
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;