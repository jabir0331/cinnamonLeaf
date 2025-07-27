import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Menu from './pages/Menu';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Testimonials from './pages/Testimonials';
import Reservation from './pages/Reservation';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cream-50">
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/reservation" element={<Reservation />} />
          </Routes>
        </Layout>
      </div>
    </Router>
  );
}

export default App;