import React from 'react';
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  title: string;
  rating: number;
  review: string;
  avatar: string;
  date: string;
}

const Testimonials: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Food Enthusiast",
      rating: 5,
      review: "The atmosphere is cozy and the food is exceptional. The herb-crusted salmon was perfectly cooked and the service was outstanding. Every detail was thoughtfully considered, from the presentation to the flavors. This has become our go-to spot for special occasions.",
      avatar: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "2 weeks ago"
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Local Resident",
      rating: 5,
      review: "Perfect spot for a family dinner. The kids loved their meals and we enjoyed the fusion dishes. The staff was incredibly accommodating with our dietary restrictions, and the warm atmosphere made our evening truly special. Will definitely be back!",
      avatar: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "1 month ago"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      title: "Travel Blogger",
      rating: 5,
      review: "As a tourist, I was looking for authentic local cuisine. Cinnamon Leaf exceeded my expectations with their creative fusion dishes. The truffle mushroom risotto was divine, and the chocolate lava cake was the perfect ending to a wonderful meal.",
      avatar: "https://images.pexels.com/photos/3763152/pexels-photo-3763152.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "3 weeks ago"
    },
    {
      id: 4,
      name: "James Wilson",
      title: "Business Executive",
      rating: 5,
      review: "I've hosted several business dinners here, and Cinnamon Leaf never disappoints. The service is professional yet warm, the ambiance is perfect for conversation, and the food quality is consistently excellent. Highly recommend for both business and personal dining.",
      avatar: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "1 week ago"
    },
    {
      id: 5,
      name: "Lisa Park",
      title: "Anniversary Celebration",
      rating: 5,
      review: "We celebrated our 10th anniversary here, and it was magical. The staff surprised us with a complimentary dessert, and the intimate lighting created the perfect romantic atmosphere. The braised short ribs were incredibly tender and flavorful.",
      avatar: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "2 months ago"
    },
    {
      id: 6,
      name: "David Thompson",
      title: "Chef & Critic",
      rating: 5,
      review: "As someone in the culinary industry, I'm impressed by the attention to detail and innovative flavor combinations. The seasonal menu showcases fresh, local ingredients beautifully. Chef Santos has created something truly special here.",
      avatar: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "6 weeks ago"
    },
    {
      id: 7,
      name: "Rachel Green",
      title: "Vegetarian Diner",
      rating: 5,
      review: "Finding a restaurant that caters well to vegetarians can be challenging, but Cinnamon Leaf exceeded all expectations. The vegetarian options are creative, flavorful, and satisfying. I never felt like an afterthought - the dishes were clearly crafted with care.",
      avatar: "https://images.pexels.com/photos/3763152/pexels-photo-3763152.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "3 weeks ago"
    },
    {
      id: 8,
      name: "Tom Anderson",
      title: "Weekend Regular",
      rating: 5,
      review: "My wife and I come here every weekend, and we're never disappointed. The consistency in food quality and service is remarkable. The staff remembers our preferences, making us feel like part of the family. The Sunday brunch is particularly outstanding.",
      avatar: "https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "4 days ago"
    }
  ];

  const averageRating = testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length;
  const totalReviews = testimonials.length;

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-warm-brown-700">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
          }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-cream-100 mb-6">
            Guest Reviews
          </h1>
          <p className="font-body text-xl text-cream-200 max-w-3xl mx-auto mb-8">
            Discover what our guests are saying about their dining experiences at Cinnamon Leaf.
          </p>
          
          {/* Rating Summary */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-2xl px-8 py-4">
            <div className="flex text-yellow-400 mr-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-current" />
              ))}
            </div>
            <div className="text-white">
              <span className="font-body text-2xl font-bold">{averageRating.toFixed(1)}</span>
              <span className="font-body text-cream-200 ml-2">({totalReviews} reviews)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-200">
                {/* Quote Icon */}
                <div className="flex justify-between items-start mb-6">
                  <Quote className="w-8 h-8 text-sage-green-400" />
                  <span className="text-sm text-warm-brown-400 font-body">{testimonial.date}</span>
                </div>

                {/* Rating */}
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="font-body text-warm-brown-600 mb-6 leading-relaxed">
                  "{testimonial.review}"
                </p>

                {/* Author Info */}
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-body text-warm-brown-700 font-semibold">
                      {testimonial.name}
                    </h4>
                    <p className="font-body text-warm-brown-500 text-sm">
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Review Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-warm-brown-700 mb-12 text-center">
            What Our Guests Love Most
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-sage-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-2">Food Quality</h3>
              <p className="font-body text-warm-brown-600">Consistently exceptional dishes with fresh, high-quality ingredients</p>
            </div>
            
            <div className="text-center">
              <div className="bg-sage-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-2">Service</h3>
              <p className="font-body text-warm-brown-600">Warm, professional staff who make every guest feel welcome</p>
            </div>
            
            <div className="text-center">
              <div className="bg-sage-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-2">Atmosphere</h3>
              <p className="font-body text-warm-brown-600">Cozy, intimate setting perfect for any occasion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-sage-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Create Your Own Experience?
          </h2>
          <p className="font-body text-xl text-sage-green-100 mb-8">
            Join the hundreds of satisfied guests who have made Cinnamon Leaf their favorite dining destination.
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
              View Our Menu
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonials;