import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '2',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '2',
        message: ''
      });
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitStatus('idle'), 3000);
    }, 1000);
  };

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-sage-green-600" />,
      title: "Address",
      details: "123 Culinary Street\nFood District, FD 12345"
    },
    {
      icon: <Phone className="w-6 h-6 text-sage-green-600" />,
      title: "Phone",
      details: "(123) 456-7890"
    },
    {
      icon: <Mail className="w-6 h-6 text-sage-green-600" />,
      title: "Email",
      details: "info@cinnamonleaf.com"
    },
    {
      icon: <Clock className="w-6 h-6 text-sage-green-600" />,
      title: "Hours",
      details: "Mon-Thu: 11:30am - 10:00pm\nFri-Sat: 11:30am - 11:00pm\nSun: 11:30am - 9:00pm"
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-warm-brown-700">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
          }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-cream-100 mb-6">
            Contact Us
          </h1>
          <p className="font-body text-xl text-cream-200 max-w-3xl mx-auto">
            Ready to experience exceptional dining? We'd love to welcome you to Cinnamon Leaf. 
            Reserve your table or get in touch with any questions.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow duration-200">
                <div className="flex justify-center mb-4">
                  {info.icon}
                </div>
                <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-3">
                  {info.title}
                </h3>
                <p className="font-body text-warm-brown-600 whitespace-pre-line">
                  {info.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reservation Form and Map */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Reservation Form */}
            <div>
              <h2 className="font-display text-3xl font-bold text-warm-brown-700 mb-8">
                Make a Reservation
              </h2>
              
              {submitStatus === 'success' && (
                <div className="bg-sage-green-100 border border-sage-green-400 text-sage-green-700 px-4 py-3 rounded-lg mb-6">
                  Thank you! Your reservation request has been submitted. We'll contact you soon to confirm.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-warm-brown-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-warm-brown-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-warm-brown-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors"
                    placeholder="(123) 456-7890"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-warm-brown-700 mb-2">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium text-warm-brown-700 mb-2">
                      Preferred Time *
                    </label>
                    <select
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors"
                    >
                      <option value="">Select time</option>
                      <option value="11:30">11:30 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="12:30">12:30 PM</option>
                      <option value="13:00">1:00 PM</option>
                      <option value="13:30">1:30 PM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="18:00">6:00 PM</option>
                      <option value="18:30">6:30 PM</option>
                      <option value="19:00">7:00 PM</option>
                      <option value="19:30">7:30 PM</option>
                      <option value="20:00">8:00 PM</option>
                      <option value="20:30">8:30 PM</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="guests" className="block text-sm font-medium text-warm-brown-700 mb-2">
                      Number of Guests *
                    </label>
                    <select
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors"
                    >
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-warm-brown-700 mb-2">
                    Special Requests or Dietary Requirements
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-cream-300 rounded-lg focus:ring-2 focus:ring-sage-green-500 focus:border-sage-green-500 transition-colors"
                    placeholder="Let us know about any allergies, dietary preferences, or special occasions..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-sage-green-600 text-white px-8 py-4 rounded-lg font-body font-semibold text-lg hover:bg-sage-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Send className="w-5 h-5 mr-2" />
                      Send Reservation Request
                    </div>
                  )}
                </button>
              </form>
            </div>

            {/* Map and Additional Info */}
            <div>
              <h2 className="font-display text-3xl font-bold text-warm-brown-700 mb-8">
                Find Us
              </h2>
              
              {/* Map Placeholder */}
              <div className="bg-cream-100 rounded-2xl h-64 mb-8 relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{
                    backgroundImage: 'url(https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800)'
                  }}
                >
                  <div className="absolute inset-0 bg-warm-brown-700/40 flex items-center justify-center">
                    <div className="text-center text-white">
                      <MapPin className="w-12 h-12 mx-auto mb-4" />
                      <p className="font-body text-lg font-semibold">Interactive Map</p>
                      <p className="font-body text-sm">123 Culinary Street, Food District</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-sage-green-50 rounded-2xl p-8">
                <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-4">
                  Need Immediate Assistance?
                </h3>
                <p className="font-body text-warm-brown-600 mb-6">
                  For same-day reservations or urgent inquiries, please call us directly.
                </p>
                <div className="space-y-4">
                  <a 
                    href="tel:+1234567890"
                    className="flex items-center text-sage-green-700 hover:text-sage-green-800 transition-colors"
                  >
                    <Phone className="w-5 h-5 mr-3" />
                    <span className="font-body font-semibold">(123) 456-7890</span>
                  </a>
                  <a 
                    href="mailto:info@cinnamonleaf.com"
                    className="flex items-center text-sage-green-700 hover:text-sage-green-800 transition-colors"
                  >
                    <Mail className="w-5 h-5 mr-3" />
                    <span className="font-body">info@cinnamonleaf.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;