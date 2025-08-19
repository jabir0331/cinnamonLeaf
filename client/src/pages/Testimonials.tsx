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
      review: "The atmosphere is cozy and the food is exceptional. The herb-crusted salmon was perfectly cooked and the service was outstanding. Every detail was thoughtfully considered. This has become our go-to spot for special occasions.",
      avatar: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "1 week ago"
    },
    {
      id: 2,
      name: "Kumara Perera",
      title: "Local Resident",
      rating: 5,
      review: "Perfect spot for a family dinner. The kids loved their meals and we enjoyed the fusion dishes. The staff was incredibly accommodating with our dietary restrictions, and the warm atmosphere made our evening truly special. Will definitely be back!",
      avatar: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "1 week ago"
    },
    {
      id: 3,
      name: "Charles Rodriguez",
      title: "Travel Blogger",
      rating: 5,
      review: "As a tourist, I was looking for authentic local cuisine. Cinnamon Leaf exceeded my expectations with their creative fusion dishes. The truffle mushroom risotto was divine, and the chocolate lava cake was the perfect ending to a wonderful meal.",
      avatar: "https://images.pexels.com/photos/3777948/pexels-photo-3777948.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "2 weeks ago"
    },
    {
      id: 4,
      name: "James Wilson",
      title: "Business Executive",
      rating: 5,
      review: "I've hosted several business dinners here, and Cinnamon Leaf never disappoints. The ambiance is perfect for conversation, and the food quality is consistently excellent. Highly recommend for both business and personal dining.",
      avatar: "https://images.pexels.com/photos/15390203/pexels-photo-15390203.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "2 weeks ago"
    },
    {
      id: 5,
      name: "Avishka Fernando",
      title: "Anniversary Celebration",
      rating: 5,
      review: "We celebrated our 10th anniversary here, and it was magical. The staff surprised us with a complimentary dessert, and the intimate lighting created the perfect romantic atmosphere. The braised short ribs were incredibly tender and flavorful.",
      avatar: "https://images.pexels.com/photos/5955134/pexels-photo-5955134.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "3 weeks ago"
    },
    {
      id: 6,
      name: "David Thompson",
      title: "Chef & Critic",
      rating: 5,
      review: "As someone in the culinary industry, I'm impressed by the attention to detail and innovative flavor combinations. The seasonal menu showcases fresh, local ingredients beautifully. Chef Santos has created something truly special here.",
      avatar: "https://images.pexels.com/photos/20709107/pexels-photo-20709107.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "1 month ago"
    },
    {
      id: 7,
      name: "Rachel Green",
      title: "Vegetarian Diner",
      rating: 5,
      review: "Finding a restaurant that caters well to vegetarians can be challenging, but Cinnamon Leaf exceeded all expectations. The vegetarian options are creative, flavorful, and satisfying. I never felt like an afterthought - the dishes were clearly crafted with care.",
      avatar: "https://images.pexels.com/photos/3777951/pexels-photo-3777951.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "1 month ago"
    },
    {
      id: 8,
      name: "Jimmy Anderson",
      title: "Weekend Regular",
      rating: 5,
      review: "My wife and I come here every weekend, and we're never disappointed. The consistency in food quality and service is remarkable. The staff remembers our preferences, making us feel like part of the family was unexpetected",
      avatar: "https://images.pexels.com/photos/27132772/pexels-photo-27132772.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "6 weeks ago"
    },
    {
      id: 9,
      name: "Priya Shankar",
      title: "Local Food Blogger",
      rating: 5,
      review: "As a Sri Lankan food enthusiast, I was curious to see how Cinnamon Leaf would blend international flavors with local influences. The result is absolutely spectacular! The fusion dishes maintain authentic Sri Lankan warmth while introducing exciting new dimensions.",
      avatar: "https://images.pexels.com/photos/3584992/pexels-photo-3584992.jpeg?auto=compress&cs=tinysrgb&w=400",
      date: "3 days ago"
    }
  ];

  return (
    <div>

      {/* Testimonials Grid */}
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-4">
            Guest Reviews
          </h2>
          <p className="font-body text-lg text-warm-brown-600 max-w-7xl mb-8">
            Discover what our guests are saying about their dining experiences at Cinnamon Leaf.
          </p>
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
      
    </div>
  );
};

export default Testimonials;