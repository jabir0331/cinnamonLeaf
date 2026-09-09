import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, string> = {
    '/': 'Home',
    '/about': 'About Us',
    '/menu': 'Menu',
    '/gallery': 'Gallery',
    '/contact': 'Contact Us',
    '/testimonials': 'Testimonials',
    '/reservation': 'Reservation',
    '/orderHistory': 'Order History',
    '/order-success': 'Order Confirmed',
    '/signup': 'Sign Up',
    '/login': 'Login',
    '/401': 'Login Required',
    '/403': 'Access Denied',
    '/admin/dashboard': 'Admin Dashboard',
    '/admin/menuManagement': 'Menu Management',
    '/admin/categoryManagement': 'Category Management',
    '/admin/customerManagement': 'Customer Management',
    '/admin/orderManagement': 'Order Management',
    '/admin/analytics': 'Analytics',
};

// Renders nothing - just keeps document.title in sync with the current route.
const PageTitle: React.FC = () => {
    const location = useLocation();

    useEffect(() => {
        const pageName = PAGE_TITLES[location.pathname] || 'Page Not Found';
        document.title = `Cinnamon Leaf | ${pageName}`;
    }, [location.pathname]);

    return null;
};

export default PageTitle;
