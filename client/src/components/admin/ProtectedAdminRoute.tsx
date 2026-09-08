import Unauthorized from '../../pages/Unauthorized';
import Forbidden from '../../pages/Forbidden';

interface ProtectedAdminRouteProps {
    children: React.ReactNode;
}

const ProtectedAdminRoute: React.FC<ProtectedAdminRouteProps> = ({ children }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        return <Unauthorized />;
    }

    if (role !== 'admin') {
        return <Forbidden />;
    }

    return <>{children}</>;
};

export default ProtectedAdminRoute;
