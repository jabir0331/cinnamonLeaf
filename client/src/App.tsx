import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Menu from './pages/Menu';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Testimonials from './pages/Testimonials';
import Reservation from './pages/Reservation';
import OrderSuccess from './pages/OrderSuccess';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import OrderHistory from './pages/OrderHistory';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
import Forbidden from './pages/Forbidden';

// Admin
import AdminLayout from './components/admin/AdminLayout/AdminLayout';
import ProtectedAdminRoute from './components/admin/ProtectedAdminRoute';
import Dashboard from './pages/admin/Dashboard';
import MenuManagement from './pages/admin/MenuManagement';
import CustomerManagement from './pages/admin/CustomerManagement';
import OrderManagement from './pages/admin/OrderManagement';
import Analytics from './pages/admin/Analytics';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cream-50">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastClassName="font-body"
          limit={1} // Limit to 1 toast at a time
        />
        <Routes>
          {/* Routes that use the Layout component */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/menu" element={<Layout><Menu /></Layout>} />
          <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/testimonials" element={<Layout><Testimonials /></Layout>} />
          <Route path="/reservation" element={<Layout><Reservation /></Layout>} />
          <Route path="/orderHistory" element={<Layout><OrderHistory /></Layout>} />

          {/* Routes that don't use the Layout component */}
          <Route path="/order-success" element={<OrderSuccess />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/401" element={<Unauthorized />} />
          <Route path="/403" element={<Forbidden />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedAdminRoute>} />
          <Route path="/admin/menuManagement" element={<ProtectedAdminRoute><AdminLayout><MenuManagement /></AdminLayout></ProtectedAdminRoute>} />
          <Route path="/admin/customerManagement" element={<ProtectedAdminRoute><AdminLayout><CustomerManagement /></AdminLayout></ProtectedAdminRoute>} />
          <Route path="/admin/orderManagement" element={<ProtectedAdminRoute><AdminLayout><OrderManagement /></AdminLayout></ProtectedAdminRoute>} />
          <Route path="/admin/analytics" element={<ProtectedAdminRoute><AdminLayout><Analytics /></AdminLayout></ProtectedAdminRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;