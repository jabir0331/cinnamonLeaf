import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Users, Award } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Award className="w-8 h-8 text-sage-green-600" />,
      title: "Award-Winning Cuisine",
      description: "Recognized for our exceptional fusion dishes and authentic flavors"
    },
    {
      icon: <Clock className="w-8 h-8 text-sage-green-600" />,
      title: "Fresh Daily",
      description: "All ingredients sourced fresh daily from local suppliers"
    },
    {
      icon: <Users className="w-8 h-8 text-sage-green-600" />,
      title: "Family Friendly",
      description: "Welcoming atmosphere perfect for families and gatherings"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Cinnamon Leaf
          </h1>
          <p className="font-body text-xl md:text-2xl mb-8 text-cream-100">
            A Taste of Comfort and Creativity
          </p>
          <p className="font-body text-lg md:text-xl mb-12 text-cream-200 max-w-2xl mx-auto">
            Experience authentic and fusion dishes crafted with passion in our cozy, 
            welcoming atmosphere. Perfect for families, professionals, and food lovers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-sage-green-600 text-white px-8 py-4 rounded-full font-body font-semibold text-lg hover:bg-sage-green-700 transition-colors duration-200"
            >
              Reserve a Table
            </Link>
            <Link
              to="/menu"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-body font-semibold text-lg hover:bg-white hover:text-warm-brown-700 transition-colors duration-200"
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-4">
              Why Choose Cinnamon Leaf?
            </h2>
            <p className="font-body text-lg text-warm-brown-600 max-w-2xl mx-auto">
              We're committed to providing an exceptional dining experience that combines 
              comfort, creativity, and quality in every dish we serve.
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
                <p className="font-body text-warm-brown-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Dishes */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-4">
              Signature Dishes
            </h2>
            <p className="font-body text-lg text-warm-brown-600">
              Taste our chef's carefully crafted specialties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl mb-6">
                <img 
                  src="https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Grilled Salmon"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-2">
                Herb-Crusted Salmon
              </h3>
              <p className="font-body text-warm-brown-600">
                Fresh Atlantic salmon with aromatic herbs and seasonal vegetables
              </p>
            </div>

            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl mb-6">
                <img 
                  src="https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Pasta Dish"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-2">
                Truffle Mushroom Risotto
              </h3>
              <p className="font-body text-warm-brown-600">
                Creamy arborio rice with wild mushrooms and truffle oil
              </p>
            </div>

            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl mb-6">
                <img 
                  src="https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Chocolate Dessert"
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-2">
                Chocolate Lava Cake
              </h3>
              <p className="font-body text-warm-brown-600">
                Warm chocolate cake with molten center and vanilla ice cream
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/menu"
              className="bg-sage-green-600 text-white px-8 py-3 rounded-full font-body font-semibold hover:bg-sage-green-700 transition-colors duration-200"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews Preview */}
      <section className="py-20 bg-sage-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-4">
              What Our Guests Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="font-body text-warm-brown-600 mb-4">
                "The atmosphere is cozy and the food is exceptional. The herb-crusted salmon 
                was perfectly cooked and the service was outstanding."
              </p>
              <div className="font-body font-semibold text-warm-brown-700">
                Sarah Johnson
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="font-body text-warm-brown-600 mb-4">
                "Perfect spot for a family dinner. The kids loved their meals and we 
                enjoyed the fusion dishes. Will definitely be back!"
              </p>
              <div className="font-body font-semibold text-warm-brown-700">
                Michael Chen
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="font-body text-warm-brown-600 mb-4">
                "As a tourist, I was looking for authentic local cuisine. Cinnamon Leaf 
                exceeded my expectations with their creative fusion dishes."
              </p>
              <div className="font-body font-semibold text-warm-brown-700">
                Emma Rodriguez
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/testimonials"
              className="bg-warm-brown-600 text-white px-8 py-3 rounded-full font-body font-semibold hover:bg-warm-brown-700 transition-colors duration-200"
            >
              Read More Reviews
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;