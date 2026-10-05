import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sofa, ChefHat, Handshake } from 'lucide-react'
import landingImg from '../assets/images/heroBg.jpg';
import { getAllCategories } from '../services/categories';
import { getAllMenuItems } from '../services/menuItems';
import { Category, MenuItem } from '../types/menu';
import { getImageUrl } from '../utils/imageUrl';

// Fisher-Yates shuffle, so every active category has a fair chance of
// showing up in the homepage's 3 featured slots across page loads.
const shuffle = <T,>(items: T[]): T[] => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

const Home: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [signatureDishes, setSignatureDishes] = useState<MenuItem[]>([]);

  useEffect(() => {
    getAllCategories()
      .then((data) => {
        if (data.success) {
          const active: Category[] = data.categories.filter((c: Category) => c.isActive);
          setCategories(shuffle(active).slice(0, 3));
        }
      })
      .catch((err: unknown) => console.error('Error fetching categories:', err));

    getAllMenuItems()
      .then((data) => {
        if (data.success) {
          const signature = data.menuItems.filter(
            (item: MenuItem) => item.signature && item.status === 'Available'
          );
          setSignatureDishes(signature.slice(0, 3));
        }
      })
      .catch((err: unknown) => console.error('Error fetching signature dishes:', err));
  }, []);

  const features = [
    {
      icon: <Sofa className="w-8 h-8 text-sage-green-600" />,
      title: "Unforgettable Atmosphere",
      description: "Enjoy a warm, elegant setting perfect for romantic dinners, family gatherings, and special occasions."
    },
    {
      icon: <ChefHat className="w-8 h-8 text-sage-green-600" />,
      title: "Inspired Culinary Creations",
      description: "Savour traditional flavours blended with modern flair in dishes crafted to excite every palate."
    },
    {
      icon: <Handshake className="w-8 h-8 text-sage-green-600" />,
      title: "Exceptional Service, Every Time",
      description: "Experience attentive service that makes every visit seamless, personalized, and truly memorable."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[70vh] sm:h-[80vh] lg:h-screen min-h-[500px] flex items-center justify-center overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/videos/heroBgVid.mp4"
          poster={landingImg}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/50"></div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-3">
            Cinnamon Leaf
          </h1>
          <p className="font-body text-xl md:text-2xl mb-8 text-cream-100 italic">
            Where every leaf tells a story...
          </p>
          <p className="font-body text-lg md:text-xl mb-12 text-cream-200 max-w-3xl mx-auto">
            Experience authentic and fusion dishes crafted with passion in our cozy, 
            welcoming atmosphere. Perfect for families, professionals, and food lovers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="bg-warm-brown-700 text-white px-12 py-3 rounded-full font-body font-semibold text-lg hover:bg-white hover:text-warm-brown-700 transition-colors duration-200"
            >
              View Menu
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white px-12 py-3 rounded-full font-body font-semibold text-lg hover:bg-white hover:text-warm-brown-700 transition-colors duration-200"
            >
              Visit Us
            </Link>
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      {categories.length > 0 && (
        <section className="mt-20 py-15 bg-cream-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-4">
                Discover Our Food Categories
              </h2>
              <p className="font-body text-lg text-warm-brown-600 max-w-5xl">
                Explore our selection of delicious favourites, from hearty meals to irresistible bites and refreshing drinks
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link key={category._id} to={`/menu?category=${category.slug}`} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl mb-6">
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-2">
                    {category.name}
                  </h3>
                  <p className="font-body text-warm-brown-600">
                    {category.description}
                  </p>
                </Link>
              ))}
            </div>

            <div className="text-right mt-12">
              <Link
                to="/menu"
                className="bg-sage-green-600 text-white px-8 py-3 rounded-full font-body font-semibold hover:bg-sage-green-700 transition-colors duration-200"
              >
                Browse All Categories
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Signature Dishes */}
      {signatureDishes.length > 0 && (
        <section className="mt-20 py-15 bg-cream-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-left mb-10">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-4">
                Our Signature Dishes
              </h2>
              <p className="font-body text-lg text-warm-brown-600">
                Discover our chef’s favorite creations, crafted with passion, bursting with flavor, and guaranteed to delight your palate
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {signatureDishes.map((dish) => (
                <div key={dish._id} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl mb-6">
                    <img
                      src={getImageUrl(dish.image)}
                      alt={dish.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-2">
                    {dish.name}
                  </h3>
                  <p className="font-body text-warm-brown-600">
                    {dish.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-right mt-12">
              <Link
                to="/menu"
                className="bg-sage-green-600 text-white px-8 py-3 rounded-full font-body font-semibold hover:bg-sage-green-700 transition-colors duration-200"
              >
                View Full Menu
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="mt-20 py-15 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-4">
              Why Choose Cinnamon Leaf?
            </h2>
            <p className="font-body text-lg text-warm-brown-600 max-w-5xl ">
              We’re dedicated to delivering a dining experience that blends comfort, creativity, and quality in every dish.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-4">
                  {feature.title}
                </h3>
                <p className="font-body text-justify text-warm-brown-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;