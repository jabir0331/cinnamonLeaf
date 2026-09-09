import React, { useState, useEffect } from 'react';
import { Megaphone } from 'lucide-react';
import { getAllPromotions } from '../services/promotions';
import { Promotion } from '../types/menu';
import { getImageUrl } from '../utils/imageUrl';
import LoadingState from '../components/LoadingState';

const formatValidUntil = (validUntil?: string) => {
  if (!validUntil) return 'Ongoing';
  const date = new Date(validUntil);
  return `Valid until ${date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`;
};

const Promotions: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllPromotions()
      .then((data) => {
        if (data.success) {
          setPromotions(data.promotions.filter((promotion: Promotion) => promotion.isActive));
        }
      })
      .catch((error) => console.error('Error fetching promotions:', error))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <LoadingState message="Loading promotions..." subMessage="Fetching the latest offers, please wait a moment" />;
  }

  return (
    <div>
      <section className="py-20 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-warm-brown-700 mb-4">
            Today's Promotions
          </h2>
          <p className="font-body text-lg text-warm-brown-600 max-w-7xl mb-8">
            Great food deserves a great deal &mdash; here's what's on offer right now.
          </p>

          {promotions.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-cream-100 to-sage-green-50 rounded-2xl p-12 mx-auto max-w-lg">
                <Megaphone size={64} className="mx-auto mb-6 text-sage-green-400" />
                <h3 className="text-xl font-display font-semibold text-warm-brown-700 mb-2">
                  No promotions right now
                </h3>
                <p className="text-warm-brown-500 font-body">
                  Check back soon &mdash; we're always cooking up new offers.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {promotions.map((promotion) => (
                <div key={promotion._id} className="flex flex-col">
                  <div className="relative rounded-2xl overflow-hidden mb-6 h-64 bg-gradient-to-br from-cream-100 to-sage-green-100 flex items-center justify-center">
                    {promotion.image ? (
                      <img
                        src={getImageUrl(promotion.image)}
                        alt={promotion.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Megaphone size={48} className="text-sage-green-300" />
                    )}
                    {promotion.badgeText && (
                      <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-warm-brown-700 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
                        {promotion.badgeText}
                      </div>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-warm-brown-700 mb-2">{promotion.title}</h3>
                  <p className="text-warm-brown-600 font-body mb-2 leading-relaxed">{promotion.description}</p>
                  <p className="text-sm text-sage-green-600 font-body">{formatValidUntil(promotion.validUntil)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Promotions;
