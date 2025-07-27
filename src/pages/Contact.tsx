import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Contact: React.FC = () => {
  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-sage-green-600" />,
      title: "Phone",
      details: "+94 77 723 3133"
    },
    {
      icon: <Mail className="w-6 h-6 text-sage-green-600" />,
      title: "Email",
      details: "info@cinnamonleaf.com"
    }
  ];

  const addressInfo = {
    icon: <MapPin className="w-6 h-6 text-sage-green-600" />,
    title: "Address",
    details: "32 Galle, \nElpitiya Rd, \nKurundugahahetekma"
  };

  return (
    <div>
      {/* Contact Information */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-4">
            Contact Us
          </h2>
          <p className="font-body text-lg text-warm-brown-600 max-w-7xl mb-8">
            Get in touch with us for any questions.
          </p>

          {/* Address and Map Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Address Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex justify-center mb-4">
                {addressInfo.icon}
              </div>
              <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-3 text-center">
                {addressInfo.title}
              </h3>
              <p className="font-body text-warm-brown-600 whitespace-pre-line text-center leading-loose">
                {addressInfo.details}
              </p>
            </div>

            {/* Map Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="flex justify-center mb-4">
                <MapPin className="w-6 h-6 text-sage-green-600" />
              </div>
              <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-3 text-center">
                Location
              </h3>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253818.17304322877!2d79.83466709453126!3d6.275700700000009!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae17fd62434fe3f%3A0x45ff8dcf08e98fdc!2sCinnamon%20Leaf%20Restaurant!5e0!3m2!1sen!2slk!4v1753558783660!5m2!1sen!2slk"
                width="100%" 
                height="200" 
                style={{border:0}} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-xl"
                title="Cinnamon Leaf Restaurant Location"
              ></iframe>
            </div>
          </div>

          {/* Phone and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow duration-200">
                <div className="flex justify-center mb-4">
                  {info.icon}
                </div>
                <h3 className="font-body text-xl font-semibold text-warm-brown-700 mb-3">
                  {info.title}
                </h3>
                <p className="font-body text-warm-brown-600">
                  {info.details}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};

export default Contact;