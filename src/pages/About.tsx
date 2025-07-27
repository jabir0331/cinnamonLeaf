import React from 'react';
import { Heart, Users, Leaf, Clock } from 'lucide-react';

const About: React.FC = () => {
  const values = [
    {
      icon: <Heart className="w-8 h-8 text-sage-green-600" />,
      title: "Passion for Food",
      description: "Every dish is crafted with love and attention to detail, ensuring exceptional flavors in every bite."
    },
    {
      icon: <Leaf className="w-8 h-8 text-sage-green-600" />,
      title: "Fresh Ingredients",
      description: "We source the finest local and seasonal ingredients to create dishes that celebrate natural flavors."
    },
    {
      icon: <Users className="w-8 h-8 text-sage-green-600" />,
      title: "Community Focus",
      description: "Building connections through food, bringing families and friends together around our table."
    },
    {
      icon: <Clock className="w-8 h-8 text-sage-green-600" />,
      title: "Time-Honored Traditions",
      description: "Blending traditional cooking methods with modern innovation to create memorable dining experiences."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-sage-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-warm-brown-700 mb-6">
              Our Story
            </h1>
            <p className="font-body text-xl text-warm-brown-600 max-w-3xl mx-auto">
              Welcome to Cinnamon Leaf, where culinary passion meets warm hospitality in every dish we serve.
            </p>
          </div>
        </div>
      </section>

      {/* Main Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-6">
                A Journey of Flavors
              </h2>
              <div className="space-y-6 font-body text-lg text-warm-brown-600">
                <p>
                  Founded in 2018, Cinnamon Leaf began as a dream to create a dining destination 
                  where authentic flavors meet innovative fusion cuisine. Our founder, Chef Maria Santos, 
                  traveled extensively to learn traditional cooking methods and bring those techniques 
                  to our modern kitchen.
                </p>
                <p>
                  What started as a small neighborhood restaurant has grown into a beloved community 
                  gathering place. We pride ourselves on creating dishes that tell stories – each 
                  recipe carefully crafted to honor culinary traditions while embracing creative innovation.
                </p>
                <p>
                  Our cozy atmosphere welcomes families celebrating special moments, young professionals 
                  enjoying a relaxing meal after work, and tourists seeking an authentic local dining 
                  experience. Every guest becomes part of our extended family.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Chef preparing food"
                className="rounded-2xl shadow-xl w-full h-96 object-cover"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-sage-green-500 rounded-full opacity-20"></div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-warm-brown-400 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-6">
              Our Values
            </h2>
            <p className="font-body text-lg text-warm-brown-600 max-w-2xl mx-auto">
              These core principles guide everything we do, from selecting ingredients 
              to creating memorable dining experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-3">
                      {value.title}
                    </h3>
                    <p className="font-body text-warm-brown-600">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-6">
              Meet Our Team
            </h2>
            <p className="font-body text-lg text-warm-brown-600">
              The passionate people behind every exceptional meal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Chef Maria Santos"
                  className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg"
                />
              </div>
              <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-2">
                Chef Maria Santos
              </h3>
              <p className="font-body text-sage-green-600 mb-3">Executive Chef & Owner</p>
              <p className="font-body text-warm-brown-600">
                With over 15 years of culinary experience, Maria brings authentic flavors 
                and innovative techniques to every dish.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://images.pexels.com/photos/3779760/pexels-photo-3779760.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="David Kim"
                  className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg"
                />
              </div>
              <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-2">
                David Kim
              </h3>
              <p className="font-body text-sage-green-600 mb-3">Sous Chef</p>
              <p className="font-body text-warm-brown-600">
                David's expertise in fusion cuisine and pastries adds creative flair 
                to our menu offerings.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <img 
                  src="https://images.pexels.com/photos/3814446/pexels-photo-3814446.jpeg?auto=compress&cs=tinysrgb&w=400"
                  alt="Isabella Rivera"
                  className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg"
                />
              </div>
              <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-2">
                Isabella Rivera
              </h3>
              <p className="font-body text-sage-green-600 mb-3">Restaurant Manager</p>
              <p className="font-body text-warm-brown-600">
                Isabella ensures every guest receives exceptional service and feels 
                welcomed in our restaurant family.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-sage-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Join Our Story?
          </h2>
          <p className="font-body text-xl text-sage-green-100 mb-8">
            Come experience the warmth, creativity, and exceptional flavors that make 
            Cinnamon Leaf a special place for every occasion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-sage-green-600 px-8 py-4 rounded-full font-body font-semibold text-lg hover:bg-cream-100 transition-colors duration-200"
            >
              Reserve Your Table
            </a>
            <a
              href="/menu"
              className="border-2 border-white text-white px-8 py-4 rounded-full font-body font-semibold text-lg hover:bg-white hover:text-sage-green-600 transition-colors duration-200"
            >
              Explore Our Menu
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;