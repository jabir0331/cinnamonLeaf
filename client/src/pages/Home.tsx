import React from 'react';
import { Link } from 'react-router-dom';
import { Sofa, ChefHat, Handshake, Star } from 'lucide-react'
import landingImg from '../assets/images/heroBg.jpg';
import signatureDish1 from '../assets/images/signatureDishes/herbCrustedSalmon.jpg';
import signatureDish2 from '../assets/images/signatureDishes/truffleMushroomRisotto.jpg'
import signatureDish3 from '../assets/images/signatureDishes/lavaCake.jpg'

const Home: React.FC = () => {
  const features = [
    {
      icon: <Sofa className="w-8 h-8 text-sage-green-600" />,
      title: "Unforgettable Atmosphere",
      description: "Step into a warm, elegant setting where every detail is designed perfect for romantic dinners, family gatherings, or special occasions."
    },
    {
      icon: <ChefHat className="w-8 h-8 text-sage-green-600" />,
      title: "Inspired Culinary Creations",
      description: "Our chefs craft each dish with passion and precision, blending traditional flavors with modern flair to create a menu that excites every palate."
    },
    {
      icon: <Handshake className="w-8 h-8 text-sage-green-600" />,
      title: "Exceptional Service, Every Time",
      description: "From the moment you arrive to the last bite, our attentive team ensures your experience is seamless, personalized, and truly memorable."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${landingImg})`
          }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Cinnamon Leaf
          </h1>
          <p className="font-body text-xl md:text-2xl mb-8 text-cream-100">
            Where Every Leaf Tells a Story...
          </p>
          <p className="font-body text-lg md:text-xl mb-12 text-cream-200 max-w-3xl mx-auto">
            Experience authentic and fusion dishes crafted with passion in our cozy, 
            welcoming atmosphere. Perfect for families, professionals, and food lovers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/reservation"
              className="bg-warm-brown-700 text-white px-12 py-3 rounded-full font-body font-semibold text-lg hover:bg-white hover:text-warm-brown-700 transition-colors duration-200"
            >
              Reserve a Table
            </Link>
            <Link
              to="/menu"
              className="border-2 border-white text-white px-12 py-3 rounded-full font-body font-semibold text-lg hover:bg-white hover:text-warm-brown-700 transition-colors duration-200"
            >
              View Menu
            </Link>
          </div>
        </div>
      </section>

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

      {/* Signature Dishes */}
      <section className="mt-20 py-15 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-4">
              Signature Dishes
            </h2>
            <p className="font-body text-lg text-warm-brown-600">
              Discover our chef’s favorite creations — crafted with passion, bursting with flavor, and guaranteed to delight your palate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-2xl mb-6">
                <img 
                  src= {signatureDish1}
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
                  src= {signatureDish2}
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
                  src= {signatureDish3}
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

      {/* Reviews Preview */}
      <section className="mt-20 py-15 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-10">
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
                Amal Gunarathna
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
                Pathum Nissanka
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
                Alex Carey
              </div>
            </div>
          </div>

          <div className="text-right mt-12">
            <Link
              to="/testimonials"
              className="bg-sage-green-600 text-white px-8 py-3 rounded-full font-body font-semibold hover:bg-sage-green-700 transition-colors duration-300"
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