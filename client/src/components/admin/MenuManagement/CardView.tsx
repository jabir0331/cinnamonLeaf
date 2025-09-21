import React from 'react';
import { Eye, Edit, Power, PowerOff, Image, Star, Flame, Salad } from 'lucide-react';
import { MenuItem } from '../../../types/menu';

interface CardViewProps {
  items: MenuItem[];
  onViewDetails: (item: MenuItem) => void;
  onEditItem: (item: MenuItem) => void;
  onToggleStatus: (itemId: string) => void;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const CardView: React.FC<CardViewProps> = ({
  items,
  onViewDetails,
  onEditItem, 
  onToggleStatus,
  onImageError
}) => {
  if (items.length === 0) {
    return (
      <div className="col-span-full text-center py-16">
        <div className="bg-gradient-to-br from-cream-50 to-sage-green-50 rounded-2xl p-12 mx-auto max-w-md">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-sage-green-200 to-warm-brown-200 rounded-full opacity-20 blur-xl"></div>
            <Image size={80} className="mx-auto mb-6 text-sage-green-400 relative z-10" />
          </div>
          <h3 className="text-xl font-display font-semibold text-gray-800 mb-2">No menu items found</h3>
          <p className="text-sage-green-600 font-body">Try adjusting your search or filter criteria to discover delicious options</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
      {items.map((item) => (
        <div
          key={item._id}
          className={`group bg-white rounded-2xl shadow-sm border border-warm-brown-100/50 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${item.status === 'Unavailable' ? 'opacity-70 grayscale-[0.3]' : ''
            }`}
        >
          {/* Image Section */}
          <div className="h-56 bg-gradient-to-br from-cream-100 to-sage-green-100 relative overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={onImageError}
            />
            <div className="hidden absolute inset-0 flex items-center justify-center text-sage-green-400 bg-gradient-to-br from-cream-50 to-sage-green-50">
              <Image size={64} />
            </div>

            {/* Status Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {item.popular && (
                <div className="flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                  <Star size={12} className="mr-1 fill-current" />
                  Popular
                </div>
              )}
              {item.status === 'Unavailable' && (
                <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg">
                  Disabled
                </div>
              )}
            </div>

            {/* Dietary Icons */}
            <div className="absolute top-3 right-3 flex gap-2">
              {item.vegetarian && (
                <div className="bg-green-500 text-white rounded-full p-1.5 shadow-lg" title="Vegetarian">
                  {/* <div className="w-3 h-3 bg-white rounded-full"></div> */}
                  <Salad size = {18} />
                </div>
              )}
              {item.spicy && (
                // <div className="bg-red-500 text-white rounded-full p-1.5 shadow-lg text-xs" title="Spicy">
                //   🌶️
                // </div>
                 <div className="bg-red-500 text-white rounded-full p-1.5 shadow-lg text-xs" title="Spicy">
                  <Flame size = {18} />
                </div>
              )}
            </div>

            {/* Gradient Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Content Section */}
          <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-xl text-gray-900 mb-1 truncate">
                  {item.name}
                </h3>

              </div>
              <div className="ml-4 text-right">
                <span className="text-2xl font-body font-bold text-warm-brown-700">
                  {item.price}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 font-body text-sm leading-relaxed line-clamp-2">
              {item.description}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
              
                <button
                  onClick={() => onViewDetails(item)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sage-green-600 hover:bg-sage-green-100 rounded-xl transition-all duration-200 hover:scale-[1.02] font-medium text-sm"
                  type="button"
                >
                  <Eye size={16} />
                  View
                </button>
                <button
                  onClick={() => onEditItem(item)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-warm-brown-600 hover:bg-warm-brown-100 rounded-xl transition-all duration-200 hover:scale-[1.02] font-medium text-sm"
                  type="button"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => onToggleStatus(item._id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] font-medium text-sm ${item.status === 'Available'
                      ? 'text-red-600 hover:bg-red-100'
                      : 'text-green-600 hover:bg-green-100'
                    }`}
                  type="button"
                >
                  {item.status === 'Available' ? (
                    <>
                      <PowerOff size={16} />
                      Disable
                    </>
                  ) : (
                    <>
                      <Power size={16} />
                      Enable
                    </>
                  )}
                </button>
              

            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardView;