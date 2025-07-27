import React, { useState } from 'react';
import { X } from 'lucide-react';

// Import all gallery images
import potatochipsImg from '../assets/images/gallery/potatochipsImg.jpg';
import frenchFries from '../assets/images/gallery/frenchFries.jpg';
import chillyCheesFrenchFries from '../assets/images/gallery/chillyCheesFrenchFries.jpg';
import momos from '../assets/images/gallery/momos.jpg';
import chickenLolipop from '../assets/images/gallery/chickenLolipop.jpg';
import crispySquid from '../assets/images/gallery/crispySquid.jpg';
import crispyChicken from '../assets/images/gallery/crispyChicken.jpg';
import grilledBBQChicken from '../assets/images/gallery/grilledBBQChicken.jpg';
import chickenSandwich from '../assets/images/gallery/chickenSandwich.jpg';
import chickenShawarma from '../assets/images/gallery/chickenShawarma.jpg';
import pizzaImg from '../assets/images/gallery/pizzaImg.jpg';

import cozyInterior from '../assets/images/gallery/interior/cozyInterior.jpg';
import familyArea from '../assets/images/gallery/interior/familyArea.jpg';
import kidsArea from '../assets/images/gallery/interior/kidsArea.jpg';
import roofTopArea from '../assets/images/gallery/interior/roofTopArea.jpg';

interface GalleryImage {
  id: number;
  src: any; // Imported image module or URL string
  alt: string;
  category: 'food' | 'interior' | 'ambiance';
}

const Gallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'food' | 'interior' | 'ambiance'>('all');

  const images: GalleryImage[] = [
    // Food Images
    { id: 1, src: potatochipsImg, alt: 'Potato Chips', category: 'food' },
    { id: 2, src: frenchFries, alt: 'Salt and Pepper French Fries', category: 'food' },
    { id: 3, src: chillyCheesFrenchFries, alt: 'Chilly Cheesy French Fries', category: 'food' },
    { id: 4, src: momos, alt: 'Chicken Mayo Momos', category: 'food' },
    { id: 5, src: chickenLolipop, alt: 'Chicken Lolipop', category: 'food' },
    { id: 6, src: crispySquid, alt: 'Crispy Squid', category: 'food' },
    { id: 7, src: crispyChicken, alt: 'Crispy Chicken', category: 'food' },
    { id: 8, src: grilledBBQChicken, alt: 'Grilled BBQ Chicken', category: 'food' },
    { id: 9, src: chickenSandwich, alt: 'Chicken Avocado Melt Sandwich', category: 'food' },
    { id: 10, src: chickenShawarma, alt: 'Cheesy Chicken Shawarma', category: 'food' },
    { id: 11, src: pizzaImg, alt: 'Hawai Chicken Pizza', category: 'food' },
    { id: 12, src: 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=800', alt: 'Gourmet Burger', category: 'food' },
    
    //Interior Images
    { id: 13, src: cozyInterior, alt: 'Main Dining Area', category: 'interior' },
    { id: 14, src: familyArea, alt: 'Family Area', category: 'interior' },
    { id: 15, src: kidsArea, alt: 'Kids Play Area', category: 'interior' },
    { id: 16, src: roofTopArea, alt: 'Roof Top Area', category: 'interior' },
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