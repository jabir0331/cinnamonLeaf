import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Menu from './pages/Menu';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Testimonials from './pages/Testimonials';
import Reservation from './pages/Reservation';
import OrderSuccess from './pages/OrderSuccess';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cream-50">
        <Routes>
          {/* Routes that use the Layout component */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/menu" element={<Layout><Menu /></Layout>} />
          <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/testimonials" element={<Layout><Testimonials /></Layout>} />
          <Route path="/reservation" element={<Layout><Reservation /></Layout>} />
          
          {/* Routes that don't use the Layout component */}
          <Route path="/order-success" element={<OrderSuccess />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;