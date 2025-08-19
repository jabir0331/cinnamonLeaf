import React from 'react';
import { Heart, Users, Leaf, Clock } from 'lucide-react';
import restaurantImg from '../assets/images/aboutUs/restaurantImg1.jpg'
import founderImg from '../assets/images/aboutUs/founder.jpg'
import cheifChefImg from '../assets/images/aboutUs/chiefChef.jpg'
import sousChefImg from '../assets/images/aboutUs/sousChef.jpg'
import managerImg from '../assets/images/aboutUs/manager.jpg'
import mixologistImg from '../assets/images/aboutUs/mixologist.jpg'
import desertSpecialistImg from '../assets/images/aboutUs/desertSpecialist.jpg'


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

      {/* Main Story Section */}
      <section className="mt-5 py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-6">
                A Journey of Flavors
              </h2>
              <div className="space-y-6 font-body text-justify text-lg text-warm-brown-600">
                <p>
                  Founded in 2018, Cinnamon Leaf began as Chef Nadeesha Perera’s vision to blend authentic
                  Sri Lankan flavors with global fusion cuisine. After exploring regional culinary traditions
                  across the island, she brought her inspirations into a modern kitchen creating a dining
                  experience that honors heritage while embracing innovation.
                </p>
                <p>
                  From a humble eatery to a cherished local favorite, Cinnamon Leaf has grown into a warm gathering place for families,
                  working professionals, and travelers. With its cozy atmosphere and soulful dishes,
                  every guest becomes part of our extended family and the story we continue to tell.
                </p>

              </div>
            </div>
            <div className="relative">
              <img
                src={restaurantImg}
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
          <div className="text-left mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-6">
              Our Values
            </h2>
            <p className="font-body text-lg text-warm-brown-600 max-w-6xl ">
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
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-6">
              Meet Our Team
            </h2>
            <p className="font-body text-lg text-warm-brown-600">
              At Cinnamon Leaf, our team brings passion, skill, and a love for Sri Lankan hospitality to your table.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="relative mb-6">
                <img
                  src={founderImg}
                  alt="Nadeesha Perera"
                  className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg"
                />
              </div>
              <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-2">
                Nadeesha Perera
              </h3>
              <p className="font-body text-sage-green-600 mb-3">Founder & Culinary Visionary</p>
              <p className="font-body text-warm-brown-600 text-justify">
                With a dream of celebrating Sri Lanka’s rich flavors on a global stage,
                Nadeesha founded Cinnamon Leaf in 2018. A seasoned traveler and self-taught cook,
                her vision blends traditional recipes with a modern twist.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <img
                  src={cheifChefImg}
                  alt="Ayaan Perera"
                  className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg"
                />
              </div>
              <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-2">
                Ayaan Perera
              </h3>
              <p className="font-body text-sage-green-600 mb-3">Executive Chef</p>
              <p className="font-body text-warm-brown-600 text-justify">
                Ayaan brings over 15 years of culinary expertise,
                having trained in both Colombo and Paris. Known for his innovative take on heritage dishes,
                his signature Hyderabad Biryani is customer favorite.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <img
                  src={sousChefImg}
                  alt="Dilan Jayasuriya"
                  className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg"
                />
              </div>
              <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-2">
                Dilan Jayasuriya
              </h3>
              <p className="font-body text-sage-green-600 mb-3">Sous Chef</p>
              <p className="font-body text-warm-brown-600 text-justify">
                Dilan ensures the heartbeat of the kitchen never misses a beat.
                With a sharp eye for detail and smooth, efficient execution,
                he supports daily prep and specializes in balancing spices and
                textures with precision.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
            <div className="text-center">
              <div className="relative mb-6">
                <img
                  src={desertSpecialistImg}
                  alt="Ruvi Samarasinghe"
                  className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg"
                />
              </div>
              <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-2">
                Ruvi Samarasinghe
              </h3>
              <p className="font-body text-sage-green-600 mb-3">Desert Specialist</p>
              <p className="font-body text-warm-brown-600 text-justify">
                Ruvi crafts every dessert with elegance and emotion.
                From velvety chocolate mousse to tangy lemon meringue tarts, his creations
                add a sweet finale to the Cinnamon Leaf experience.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <img
                  src={mixologistImg}
                  alt="Nimal Silva"
                  className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg"
                />
              </div>
              <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-2">
                Nimal Silva
              </h3>
              <p className="font-body text-sage-green-600 mb-3">Mixologist</p>
              <p className="font-body text-warm-brown-600 text-justify">
                A master of flavor pairings and presentation, Nimal curates our 
                handcrafted beverages menu. His cinnamon-spiced mojito and hibiscus spritz are the talk of the town.
              </p>
            </div>

            <div className="text-center">
              <div className="relative mb-6">
                <img
                  src={managerImg}
                  alt="Ahamed Ali"
                  className="w-48 h-48 rounded-full mx-auto object-cover shadow-lg"
                />
              </div>
              <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-2">
                Ahamed Ali
              </h3>
              <p className="font-body text-sage-green-600 mb-3">Restaurant Manager</p>
              <p className="font-body text-warm-brown-600 text-justify">
                Ali Ensures every guest feels welcome from the moment they step in.
                With years of front-of-house management, he leads the team with
                efficiency and a smile you won’t forget.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;