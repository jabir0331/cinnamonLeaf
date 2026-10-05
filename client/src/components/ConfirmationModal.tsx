import React from 'react';
import { CheckCircle, X, Package, Clock, MapPin } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  // New customers get a confirmation call; returning customers' orders go straight to the kitchen
  isNewCustomer: boolean;
  estimatedDelivery: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  isNewCustomer,
  estimatedDelivery
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
        
        <div className="relative bg-white rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-warm-brown-50 via-cream-50 to-sage-green-50 px-8 py-6 border-b border-warm-brown-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-display font-bold text-warm-brown-800 mb-1">Order Confirmed!</h2>
                <p className="text-sage-green-600 font-body">Thank you for your order. We'll prepare it with care!</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="group p-3 text-gray-400 hover:text-gray-600 hover:bg-white/80 rounded-2xl transition-all duration-200 hover:scale-110"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-200" />
              </button>
            </div>
          </div>

          <div className="p-8 text-center">
            {/* Success Icon */}
            <div className="mx-auto mb-6 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={32} className="text-green-600" />
            </div>

            {/* Order Details */}
            <div className="bg-cream-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Package size={18} className="text-sage-green-600" />
                  <div>
                    <div className="font-body text-sm text-warm-brown-500">Order Number</div>
                    <div className="font-body font-semibold text-warm-brown-700">#{orderNumber}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock size={18} className="text-sage-green-600" />
                  <div>
                    <div className="font-body text-sm text-warm-brown-500">Estimated Delivery</div>
                    <div className="font-body font-semibold text-warm-brown-700">{estimatedDelivery}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-sage-green-600" />
                  <div>
                    <div className="font-body text-sm text-warm-brown-500">Payment Method</div>
                    <div className="font-body font-semibold text-warm-brown-700">Cash on Delivery</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <p className="font-body text-sm text-warm-brown-500 mb-6">
              {isNewCustomer
                ? "We'll call you shortly to confirm your order details and delivery time."
                : "Your order has gone straight to our kitchen. We'll start preparing it right away."}
            </p>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full bg-sage-green-600 hover:bg-sage-green-700 text-white font-body font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;