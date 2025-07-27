import React, { useState } from 'react';
import { X } from 'lucide-react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: 'food' | 'interior' | 'ambiance';
}

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'food' | 'interior' | 'ambiance'>('all');

  const images: GalleryImage[] = [
    // Food Images
    { id: 1, src: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Herb-Crusted Salmon', category: 'food' },
    { id: 2, src: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Truffle Mushroom Risotto', category: 'food' },
    { id: 3, src: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Chocolate Lava Cake', category: 'food' },
    { id: 4, src: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Chef\'s Special', category: 'food' },
    { id: 5, src: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Fresh Salad', category: 'food' },
    { id: 6, src: 'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Gourmet Burger', category: 'food' },
    
    // Interior Images
    { id: 7, src: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Main Dining Area', category: 'interior' },
    { id: 8, src: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Cozy Corner Seating', category: 'interior' },
    { id: 9, src: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Bar Area', category: 'interior' },
    { id: 10, src: 'https://images.pexels.com/photos/3201921/pexels-photo-3201921.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Private Dining Room', category: 'interior' },
    
    // Ambiance Images
    { id: 11, src: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Chef at Work', category: 'ambiance' },
    { id: 12, src: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Evening Atmosphere', category: 'ambiance' },
    { id: 13, src: 'https://images.pexels.com/photos/2788792/pexels-photo-2788792.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Intimate Dining', category: 'ambiance' },
    { id: 14, src: 'https://images.pexels.com/photos/1581384/pexels-photo-1581384.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Social Gathering', category: 'ambiance' },
  ];

  const filteredImages = activeFilter === 'all' 
    ? images 
    : images.filter(image => image.category === activeFilter);

  const filterButtons = [
    { id: 'all', label: 'All Photos' },
    { id: 'food', label: 'Our Dishes' },
    { id: 'interior', label: 'Interior' },
    { id: 'ambiance', label: 'Atmosphere' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 bg-warm-brown-700">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
          }}
        ></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-cream-100 mb-6">
            Gallery
          </h1>
          <p className="font-body text-xl text-cream-200 max-w-3xl mx-auto">
            Step inside our world and discover the artistry behind every dish and 
            the warmth of our welcoming atmosphere.
          </p>
        </div>
      </section>

      {/* Filter Navigation */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {filterButtons.map((button) => (
              <button
                key={button.id}
                onClick={() => setActiveFilter(button.id as any)}
                className={`px-6 py-3 rounded-full font-body font-medium transition-colors duration-200 ${
                  activeFilter === button.id
                    ? 'bg-sage-green-600 text-white'
                    : 'bg-cream-100 text-warm-brown-600 hover:bg-sage-green-100 hover:text-sage-green-700'
                }`}
              >
                {button.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                onClick={() => setSelectedImage(image)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="font-body font-semibold text-sm">{image.alt}</h3>
                  <p className="font-body text-xs text-cream-200 capitalize">{image.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="w-full h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h3 className="font-body font-semibold text-lg mb-1">{selectedImage.alt}</h3>
              <p className="font-body text-cream-200 capitalize">{selectedImage.category}</p>
            </div>
          </div>
        </div>
      )}

      {/* Visit Us Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-6">
            Experience It In Person
          </h2>
          <p className="font-body text-lg text-warm-brown-600 mb-8">
            While photos capture moments, nothing compares to experiencing the warmth, 
            aromas, and flavors of Cinnamon Leaf firsthand. Join us for an unforgettable 
            dining experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-sage-green-600 text-white px-8 py-4 rounded-full font-body font-semibold text-lg hover:bg-sage-green-700 transition-colors duration-200"
            >
              Reserve Your Table
            </a>
            <a
              href="/menu"
              className="border-2 border-sage-green-600 text-sage-green-600 px-8 py-4 rounded-full font-body font-semibold text-lg hover:bg-sage-green-600 hover:text-white transition-colors duration-200"
            >
              View Our Menu
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Gallery;