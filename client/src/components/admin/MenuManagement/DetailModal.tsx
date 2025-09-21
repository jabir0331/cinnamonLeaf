import React from 'react';
import { Edit, Power, PowerOff, Image, X, Star, Clock, Utensils, Flame, Salad } from 'lucide-react';
import { MenuItem } from '../../../types/menu';

interface DetailModalProps {
  isOpen: boolean;
  item: MenuItem | null;
  onClose: () => void;
  onEditItem: (item: MenuItem) => void;
  onToggleStatus: (itemId: string) => void;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  item,
  onClose,
  onEditItem, 
  onToggleStatus,
  onImageError
}) => {
  if (!isOpen || !item) return null;

  console.log('MenuItem in view:', item);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-5 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-warm-brown-50 via-cream-50 to-sage-green-50 px-8 py-6 border-b border-warm-brown-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-display font-bold text-warm-brown-800 mb-1">Menu Item Details</h3>
              <p className="text-sage-green-600 font-body">Complete information and management options</p>
            </div>
            <button
              onClick={onClose}
              className="group p-3 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-2xl transition-all duration-200 hover:scale-110"
              type="button"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Section */}
            <div className="space-y-6">
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-cream-100 to-sage-green-100 shadow-lg relative group">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={onImageError}
                  />
                  <div className="hidden absolute inset-0 flex items-center justify-center text-sage-green-400 bg-gradient-to-br from-cream-50 to-sage-green-50">
                    <Image size={80} />
                  </div>

                  {/* Overlay Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-3">
                    {item.popular && (
                      <div className="flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-xl">
                        <Star size={16} className="mr-2 fill-current" />
                        Popular Choice
                      </div>
                    )}
                  </div>

                  <div className="absolute top-4 right-4 flex gap-3">
                    {item.vegetarian && (
                      <div className="bg-green-500 text-white rounded-full p-2 shadow-xl" title="Vegetarian">
                        <Salad size={16} />
                      </div>
                    )}
                    {item.spicy && (
                      // <div className="bg-red-500 text-white rounded-full p-2 shadow-xl" title="Spicy">
                      //   <span className="text-sm">🌶️</span>
                      // </div>
                      <div className="bg-red-500 text-white rounded-full p-2 shadow-xl" title="Spicy">
                        <span className="text-sm"><Flame size = {15} /> </span>
                      </div>
                    )}
                  </div>

                  {/* Status Overlay */}
                  {item.status === 'Unavailable' && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="bg-red-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-xl">
                        Currently Unavailable
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Indicators */}
              <div className="flex flex-wrap gap-3 justify-center">
                <div className={`w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium rounded-2xl shadow-sm border ${item.status === 'Available'
                  ? 'bg-green-50 text-green-800 border-green-200'
                  : 'bg-red-50 text-red-800 border-red-200'
                  }`}>
                  <div className={`w-2 h-2 rounded-full mr-3 ${item.status === 'Available' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                  {item.status === 'Available' ? 'Available Now' : 'Currently Unavailable'}
                </div>

                <div className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-medium bg-warm-brown-50 text-warm-brown-800 border border-warm-brown-200 rounded-2xl shadow-sm">
                  <Clock size={14} className="mr-2" />
                  Last Updated: {item.updatedAt ? new Date(item.updatedAt).toLocaleString() : 'N/A'}
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              {/* Item Name & Price */}
              <div className="bg-gradient-to-br from-cream-50 to-sage-green-50 p-6 rounded-2xl border border-warm-brown-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Item Name</h4>
                    <p className="text-2xl font-display font-bold text-gray-900 leading-tight">{item.name}</p>
                  </div>

                </div>

                <div className="flex items-start justify-between mb-4">
                  {/* Category */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Category</h4>
                      <span className="inline-flex items-center px-4 py-2 text-sm font-medium bg-sage-green-100 text-sage-green-800 border border-sage-green-200 rounded-full">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <h4 className="text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-2 font-body">Price</h4>
                    <p className="text-3xl font-body font-bold text-warm-brown-700">{item.price}</p>
                  </div>
                </div>

              </div>

              {/* Description */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h4 className="text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-3 font-body">Description</h4>
                <p className="text-gray-700 leading-relaxed font-body text-base">{item.description}</p>
              </div>

              {/* Properties */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <h4 className="text-sm font-medium text-sage-green-600 uppercase tracking-wider mb-4 font-body">Dietary Information</h4>
                <div className="flex flex-wrap gap-3">
                  {item.vegetarian && (
                    <div className="flex items-center bg-green-50 border border-green-200 px-4 py-2 rounded-full">
                      {/* <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div> */}
                      <span className="text-green-500 mr-2"><Salad size = {18} /></span>
                      <span className="text-sm font-medium text-green-800">Vegetarian</span>
                    </div>
                  )}
                  {item.spicy && (
                    <div className="flex items-center bg-red-50 border border-red-200 px-4 py-2 rounded-full">
                      {/* <span className="text-red-500 mr-2">🌶️</span> */}
                      <span className="text-red-500 mr-2"><Flame size = {18} /></span>
                      <span className="text-sm font-medium text-red-800">Spicy</span>
                    </div>
                  )}
                  {!item.vegetarian && !item.spicy && (
                    <div className="flex items-center bg-gray-50 border border-gray-200 px-4 py-2 rounded-full">
                      <span className="text-sm font-medium text-gray-600">No special dietary requirements</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => onEditItem(item)}
              className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-warm-brown-500 to-warm-brown-600 text-white px-6 py-4 rounded-2xl hover:from-warm-brown-600 hover:to-warm-brown-700 transition-all duration-200 hover:scale-[1.02] shadow-lg font-medium"
              type="button"
            >
              <Edit size={20} />
              <span>Edit Item Details</span>
            </button>
            <button
              onClick={() => onToggleStatus(item._id)}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl transition-all duration-200 hover:scale-[1.02] shadow-lg font-medium ${item.status === 'Available'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                }`}
              type="button"
            >
              {item.status === 'Available' ? <PowerOff size={20} /> : <Power size={20} />}
              <span>{item.status === 'Available' ? 'Disable Item' : 'Enable Item'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailModal;