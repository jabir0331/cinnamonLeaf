import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, DollarSign } from 'lucide-react';
import { CartItem } from '../types/cart';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
  totalPrice: number;
}

const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  totalPrice
}) => {
  if (!isOpen) return null;

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-sage-green-50 to-cream-50 border-b border-cream-200 px-6 py-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sage-green-100 rounded-lg">
                  <ShoppingBag size={20} className="text-sage-green-600" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-bold text-warm-brown-800">
                    Your Cart
                  </h2>
                  <p className="font-body text-sm text-warm-brown-600">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-warm-brown-100 rounded-full transition-all duration-200 hover:scale-105"
              >
                <X size={20} className="text-warm-brown-600" />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-cream-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={32} className="text-cream-400" />
                </div>
                <h3 className="font-body font-semibold text-warm-brown-700 mb-2">
                  Your cart is empty
                </h3>
                <p className="font-body text-sm text-warm-brown-500">
                  Add some delicious items to get started
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={item.id} className="bg-white border border-cream-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex gap-4">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-xl shadow-sm"
                        />
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-sage-green-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-body font-semibold text-warm-brown-800 text-sm leading-tight">
                            {item.name}
                          </h3>
                          <button
                            onClick={() => onRemoveItem(item.id)}
                            className="p-1.5 hover:bg-red-50 rounded-full transition-colors duration-200 ml-2"
                          >
                            <Trash2 size={14} className="text-red-500" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            
                            <span className="font-body text-sage-green-600 font-semibold text-sm">
                              LKR {item.price.toLocaleString()}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 bg-cream-50 rounded-lg p-1">
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                              className="p-1.5 hover:bg-warm-brown-100 rounded-md transition-colors duration-200"
                            >
                              <Minus size={12} className="text-warm-brown-600" />
                            </button>
                            <span className="font-body font-semibold text-warm-brown-700 min-w-[2rem] text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="p-1.5 hover:bg-warm-brown-100 rounded-md transition-colors duration-200"
                            >
                              <Plus size={12} className="text-warm-brown-600" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-right">
                          <span className="font-body text-xs text-warm-brown-500">
                            Subtotal: 
                          </span>
                          <span className="font-body font-semibold text-warm-brown-700 text-sm ml-1">
                            LKR {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-cream-200 bg-gradient-to-b from-white to-cream-50">
              {/* Order Summary */}
              <div className="px-6 py-4 border-b border-cream-100">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-body text-warm-brown-600">
                      Subtotal ({itemCount} items)
                    </span>
                    <span className="font-body font-medium text-warm-brown-700">
                      LKR {totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-body text-warm-brown-600">Delivery</span>
                    <span className="font-body font-medium text-sage-green-600">FREE</span>
                  </div>
                </div>
              </div>
              
              {/* Total and Checkout */}
              <div className="px-6 py-5">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-display text-lg font-bold text-warm-brown-800">
                    Total
                  </span>
                  <div className="flex items-center gap-1">
                    
                    <span className="font-body text-xl font-bold text-sage-green-600">
                      LKR {totalPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={onCheckout}
                  className="w-full bg-gradient-to-r from-sage-green-600 to-sage-green-700 hover:from-sage-green-700 hover:to-sage-green-800 text-white font-body font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Proceed to Checkout
                </button>
                
                <p className="text-center text-xs text-warm-brown-500 mt-3">
                  Secure checkout • Free delivery • 30-45 min
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;