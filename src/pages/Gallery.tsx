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
    { id: 1, src: '/src/assets/images/gallery/potatochipsImg.jpg', alt: 'Potato Chips', category: 'food' },
    { id: 2, src: '/src/assets/images/gallery/frenchFries.jpg', alt: 'Salt and Pepper French Fries', category: 'food' },
    { id: 3, src: '/src/assets/images/gallery/chillyCheesFrenchFries.jpg', alt: 'Chilly Cheesy French Fries', category: 'food' },
    { id: 4, src: '/src/assets/images/gallery/momos.jpg', alt: 'Chicken Mayo Momos', category: 'food' },
    { id: 5, src: '/src/assets/images/gallery/chickenLolipop.jpg', alt: 'Chicken Lolipop', category: 'food' },
    { id: 6, src: '/src/assets/images/gallery/crispySquid.jpg', alt: 'Crispy Squid', category: 'food' },
    { id: 7, src: '/src/assets/images/gallery/crispyChicken.jpg', alt: 'Crispy Chicken', category: 'food' },
    { id: 8, src: '/src/assets/images/gallery/grilledBBQChicken.jpg', alt: 'Grilled BBQ Chicken', category: 'food' },
    { id: 9, src: '/src/assets/images/gallery/chickenSandwich.jpg', alt: 'Chicken Avocado Melt Sandwich', category: 'food' },
    { id: 10, src: '/src/assets/images/gallery/chickenShawarma.jpg', alt: 'Cheesy Chicken Shawarma', category: 'food' },
    { id: 11, src: '/src/assets/images/gallery/pizzaImg.jpg', alt: 'Hawai Chicken Pizza', category: 'food' },
    { id: 12, src: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Gourmet Burger', category: 'food' },
    
    //Interior Images
    { id: 13, src: '/src/assets/images/gallery/interior/cozyInterior.jpg', alt: 'Main Dining Area', category: 'interior' },
    { id: 14, src: '/src/assets/images/gallery/interior/familyArea.jpg', alt: 'Family Area', category: 'interior' },
    { id: 15, src: '/src/assets/images/gallery/interior/kidsArea.jpg', alt: 'Kids Play Area', category: 'interior' },
    { id: 16, src: '/src/assets/images/gallery/interior/roofTopArea.jpg', alt: 'Roof Top Area', category: 'interior' },
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

      {/* Gallery Grid */}
      <section className="py-16 bg-cream-50">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-4">
            Gallery
          </h2>
          <p className="font-body text-lg text-warm-brown-600 max-w-7xl mb-8">
            Step inside our world and discover the artistry behind every dish and
            the warmth of our welcoming atmosphere.
          </p>
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

     
    </div>
  );
};

export default Gallery;